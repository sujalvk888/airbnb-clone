// server/routes/listingRoutes.js

import express from 'express';
import { prisma } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// 1. GET ALL LISTINGS (Public Route for Homepage) - ADVANCED SEARCH
router.get('/', async (req, res) => {
  try {
    const { location, guestCount, checkIn, checkOut } = req.query;

    let queryObj = {};

    if (location) {
      queryObj.location = { contains: location, mode: 'insensitive' };
    }

    if (guestCount) {
      queryObj.maxGuests = { gte: parseInt(guestCount) };
    }

    if (checkIn && checkOut) {
      const searchCheckIn = new Date(checkIn);
      const searchCheckOut = new Date(checkOut);

      queryObj.bookings = {
        none: {
          status: 'CONFIRMED',
          OR: [
            {
              checkIn: { lt: searchCheckOut },
              checkOut: { gt: searchCheckIn }
            }
          ]
        }
      };
    }

    const listings = await prisma.listing.findMany({
      where: queryObj,
      include: {
        images: { where: { isCover: true }, take: 1 },
        reviews: { select: { rating: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedListings = listings.map(listing => {
      const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = listing.reviews.length > 0 ? (totalRating / listing.reviews.length).toFixed(2) : null;

      return {
        ...listing,
        coverImage: listing.images[0]?.url || 'https://placehold.co/600x400?text=No+Image',
        avgRating,
        images: undefined, 
        reviews: undefined 
      };
    });

    res.status(200).json(formattedListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Internal system error while fetching listings.' });
  }
});

// 2. GET LOGGED-IN HOST'S LISTINGS (Protected Route)
router.get('/my-listings', verifyToken, async (req, res) => {
  try {
    const myListings = await prisma.listing.findMany({
      where: { hostId: req.user.id },
      include: {
        images: { where: { isCover: true }, take: 1 },
        reviews: { select: { rating: true } },
        bookings: { 
          where: { status: 'CONFIRMED' },
          select: { totalPrice: true, checkOut: true } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const today = new Date();
    const formatted = myListings.map(listing => {
      const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = listing.reviews.length > 0 ? (totalRating / listing.reviews.length).toFixed(2) : null;
      
      const totalEarnings = listing.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      // Check for active bookings
      const hasActiveBookings = listing.bookings.some(b => new Date(b.checkOut) >= today);

      return {
        ...listing,
        coverImage: listing.images[0]?.url || 'https://placehold.co/600x400?text=No+Image',
        avgRating,
        totalBookings: listing.bookings.length,
        totalEarnings,
        hasActiveBookings, // NEW: Expose to frontend
        images: undefined,
        reviews: undefined,
        bookings: undefined
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching host listings:', error);
    res.status(500).json({ error: 'Internal system error while fetching your properties.' });
  }
});

// 3. GET SINGLE LISTING BY ID (Public Route for Detail Page)
router.get('/:id', async (req, res) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        images: { orderBy: { isCover: 'desc' } },
        host: {
          select: { id: true, firstName: true, lastName: true, profileImage: true, bio: true, createdAt: true, email: true }
        },
        reviews: {
          include: { user: { select: { firstName: true, profileImage: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!listing) return res.status(404).json({ error: 'Listing not found.' });

    const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = listing.reviews.length > 0 ? (totalRating / listing.reviews.length).toFixed(2) : null;

    res.status(200).json({ ...listing, avgRating });
  } catch (error) {
    console.error('Error fetching single listing:', error);
    res.status(500).json({ error: 'Internal system error while fetching the listing.' });
  }
});

// 4. CREATE NEW LISTING (Protected Route)
router.post('/', verifyToken, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length !== 5) {
      return res.status(400).json({ error: 'Exactly 5 images are required to create a valid listing.' });
    }

    const {
      title, description, propertyType, location, googleMapsUrl,
      maxGuests, bedrooms, beds, baths,
      pricePerNight, cleaningFee, discountPct,
      hasWifi, hasPool, hasKitchen, hasParking, hasAc, hasTv,
      hasWasher, hasDryer, hasHeating, hasWorkspace, hasGym, hasHotTub, 
      coverImageIndex
    } = req.body;

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'airbnb_listings'));
    const imageUrls = await Promise.all(uploadPromises);

    const parsedCoverIndex = parseInt(coverImageIndex) || 0;

    const imagesData = imageUrls.map((url, index) => ({
      url: url,
      isCover: index === parsedCoverIndex
    }));

    const newListing = await prisma.listing.create({
      data: {
        title, description, propertyType, location,
        googleMapsUrl: googleMapsUrl || null,
        maxGuests: parseInt(maxGuests), bedrooms: parseInt(bedrooms),
        beds: parseInt(beds), baths: parseFloat(baths),
        pricePerNight: parseFloat(pricePerNight),
        cleaningFee: parseFloat(cleaningFee) || 0,
        discountPct: parseFloat(discountPct) || 0,
        
        hasWifi: hasWifi === 'true', 
        hasPool: hasPool === 'true',
        hasKitchen: hasKitchen === 'true', 
        hasParking: hasParking === 'true',
        hasAc: hasAc === 'true', 
        hasTv: hasTv === 'true',
        hasWasher: hasWasher === 'true', 
        hasDryer: hasDryer === 'true',
        hasHeating: hasHeating === 'true', 
        hasWorkspace: hasWorkspace === 'true',
        hasGym: hasGym === 'true', 
        hasHotTub: hasHotTub === 'true',

        hostId: req.user.id,
        images: { create: imagesData }
      },
      include: { images: true }
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error('Failed to create listing:', error);
    res.status(500).json({ error: 'Internal system error while creating the property listing.' });
  }
});

// 5. UPDATE EXISTING LISTING (Protected Route)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, propertyType, location, googleMapsUrl,
            maxGuests, bedrooms, beds, baths,
            pricePerNight, cleaningFee, discountPct,
            hasWifi, hasPool, hasKitchen, hasParking, hasAc, hasTv,
            hasWasher, hasDryer, hasHeating, hasWorkspace, hasGym, hasHotTub
        } = req.body;

        const listing = await prisma.listing.findUnique({
            where: { id },
            include: { host: true, bookings: true }
        });

        if (!listing) return res.status(404).json({ error: 'Listing not found.' });
        if (listing.hostId !== req.user.id) return res.status(403).json({ error: 'Unauthorized to edit this listing.' });

        // Update the listing
        const updatedListing = await prisma.listing.update({
            where: { id },
            data: {
                title, description, propertyType, location, googleMapsUrl: googleMapsUrl || null,
                maxGuests: parseInt(maxGuests), bedrooms: parseInt(bedrooms),
                beds: parseInt(beds), baths: parseFloat(baths),
                pricePerNight: parseFloat(pricePerNight),
                cleaningFee: parseFloat(cleaningFee) || 0,
                discountPct: parseFloat(discountPct) || 0,
                hasWifi, hasPool, hasKitchen, hasParking, hasAc, hasTv,
                hasWasher, hasDryer, hasHeating, hasWorkspace, hasGym, hasHotTub
            }
        });

        // Notify guests with upcoming or active bookings
        const today = new Date();
        const activeBookings = listing.bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.checkOut) >= today);
        const uniqueUserIdsToNotify = [...new Set(activeBookings.map(b => b.userId))];

        if (uniqueUserIdsToNotify.length > 0) {
            const notifications = uniqueUserIdsToNotify.map(userId => ({
                userId,
                message: `The host recently updated details for "${listing.title}". Please review the listing to see the changes.`,
                hostEmail: listing.host.email,
                propertyName: listing.title
            }));
            await prisma.notification.createMany({ data: notifications });
        }

        res.status(200).json(updatedListing);
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing.' });
    }
});

// 6. DELETE LISTING (Protected Route)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await prisma.listing.findUnique({
            where: { id },
            include: { bookings: true }
        });

        if (!listing) return res.status(404).json({ error: 'Listing not found.' });
        if (listing.hostId !== req.user.id) return res.status(403).json({ error: 'Unauthorized to delete this listing.' });

        // Check if there are active bookings
        const today = new Date();
        const hasActiveBookings = listing.bookings.some(b => b.status === 'CONFIRMED' && new Date(b.checkOut) >= today);

        if (hasActiveBookings) {
            return res.status(400).json({ error: 'Cannot delete property. You have active or upcoming reservations.' });
        }

        await prisma.listing.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Listing deleted successfully.' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Failed to delete listing.' });
    }
});

// 7. GET USER NOTIFICATIONS
router.get('/notifications/me', verifyToken, async (req, res) => {
    try {
      const notifs = await prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(notifs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
  });
  
  // 8. MARK NOTIFICATION READ
  router.put('/notifications/:id/read', verifyToken, async (req, res) => {
    try {
      await prisma.notification.update({
        where: { id: req.params.id },
        data: { isRead: true }
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark read.' });
    }
  });

export default router;