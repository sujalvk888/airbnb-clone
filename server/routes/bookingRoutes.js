// server/routes/bookingRoutes.js

import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import 'dotenv/config';

const router = express.Router();

// Initialize Stripe (Fallback prevents crashing if key is missing during setup)
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
);

// 1. INITIATE BOOKING (Creates Stripe Checkout Session)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guestCount } = req.body;

    if (!listingId || !checkIn || !checkOut || !guestCount) {
      return res.status(400).json({
        error: 'All booking fields are strictly required.'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent past bookings
    if (checkInDate < today) {
      return res.status(400).json({
        error: 'Check-in date cannot be in the past.'
      });
    }

    // Prevent invalid ranges
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        error: 'Check-out date must be after check-in date.'
      });
    }

    // Define frontend URL ONCE
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:5173';

    // Step A: Fetch Listing and Validate
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        images: {
          where: { isCover: true },
          take: 1
        }
      }
    });

    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found.'
      });
    }

    if (guestCount > listing.maxGuests) {
      return res.status(400).json({
        error: `Maximum allowed guests is ${listing.maxGuests}.`
      });
    }

    if (listing.hostId === req.user.id) {
      return res.status(400).json({
        error: 'You cannot book your own property.'
      });
    }

    // Step B: Double-Booking Prevention Logic
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        listingId,
        OR: [
          {
            checkIn: { lt: checkOutDate },
            checkOut: { gt: checkInDate }
          }
        ]
      }
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        error: 'These dates are already booked by another guest.'
      });
    }

    // Step C: Secure Backend Math Calculation for Stripe
    const timeDifference =
      checkOutDate.getTime() - checkInDate.getTime();

    const days = Math.ceil(
      timeDifference / (1000 * 3600 * 24)
    );

    const basePrice = days * listing.pricePerNight;

    const discountAmount =
      listing.discountPct > 0
        ? basePrice * (listing.discountPct / 100)
        : 0;

    const secureTotalPrice =
      basePrice +
      listing.cleaningFee -
      discountAmount;

    // Step D: Safety fallback if Stripe Key is missing
    if (
      !process.env.STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder'
    ) {
      console.warn(
        'Stripe key missing. Simulating payment and creating booking directly.'
      );

      await prisma.booking.create({
        data: {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guestCount: Number(guestCount),
          totalPrice: secureTotalPrice,
          userId: req.user.id,
          listingId
        }
      });

      return res.status(200).json({
        simulated: true,
        url: `${frontendUrl}/payment-success`
      });
    }

    // Step E: Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Stay at ${listing.title}`,
              description: `${days} nights (${checkIn} to ${checkOut}) for ${guestCount} guests.`,
              images: listing.images[0]
                ? [listing.images[0].url]
                : []
            },
            unit_amount: Math.round(
              secureTotalPrice * 100
            )
          },
          quantity: 1
        }
      ],

      success_url:
        `${frontendUrl}/payment-success` +
        `?session_id={CHECKOUT_SESSION_ID}` +
        `&listingId=${listingId}` +
        `&checkIn=${checkIn}` +
        `&checkOut=${checkOut}` +
        `&guestCount=${guestCount}` +
        `&totalPrice=${secureTotalPrice}`,

      cancel_url: `${frontendUrl}/listings/${listingId}`
    });

    // Return the Stripe URL to the React frontend
    return res.status(200).json({
      url: session.url
    });

  } catch (error) {
    console.error(
      'Failed to create Stripe session:',
      error
    );

    return res.status(500).json({
      error: 'Internal system error initiating payment.'
    });
  }
});

// 2. FULFILL BOOKING (Called by React after successful Stripe payment)
router.post('/confirm', verifyToken, async (req, res) => {
  try {
    const {
      listingId,
      checkIn,
      checkOut,
      guestCount,
      totalPrice,
      sessionId
    } = req.body;

    if (!listingId || !checkIn || !checkOut || !sessionId) {
      return res.status(400).json({
        error: 'Missing required confirmation data.'
      });
    }

    // Verify payment with Stripe before creating booking
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        error: 'Payment not completed.'
      });
    }

    const newBooking = await prisma.booking.create({
      data: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guestCount: Number(guestCount),
        totalPrice: Number(totalPrice),
        userId: req.user.id,
        listingId,
        status: 'CONFIRMED'
      }
    });

    return res.status(201).json(newBooking);

  } catch (error) {
    console.error(
      'Failed to confirm booking:',
      error
    );

    return res.status(500).json({
      error: 'Failed to record booking in database.'
    });
  }
});

// 3. GET USER TRIPS (My Trips)
router.get('/my-trips', verifyToken, async (req, res) => {
  try {
    const trips = await prisma.booking.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        checkIn: 'asc'
      },
      include: {
        listing: {
          select: {
            title: true,
            location: true,
            images: {
              where: { isCover: true },
              take: 1
            }
          }
        }
      }
    });

    const formattedTrips = trips.map((trip) => ({
      ...trip,
      listing: {
        ...trip.listing,
        coverImage:
          trip.listing.images[0]?.url ||
          'https://placehold.co/600x400'
      }
    }));

    return res.status(200).json(formattedTrips);

  } catch (error) {
    console.error(
      'Failed to fetch trips:',
      error
    );

    return res.status(500).json({
      error: 'Internal system error fetching trips.'
    });
  }
});

export default router;