// server/routes/reviewRoutes.js

import express from 'express';
import { prisma } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// CREATE A REVIEW (Upgraded with Strict Booking Verification)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    if (!listingId || !rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are strictly required.' });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    // Step A: Fetch Listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    // Step B: Prevent Host from reviewing their own property
    if (listing.hostId === req.user.id) {
      return res.status(403).json({ error: 'You cannot leave a review on your own property.' });
    }

    // Step C: STRICT POLICY - Verify user has a completed booking
    // The checkOut date must be strictly less than the current exact date/time
    const completedBooking = await prisma.booking.findFirst({
      where: {
        listingId: listingId,
        userId: req.user.id,
        status: 'CONFIRMED',
        checkOut: { lt: new Date() } 
      }
    });

    if (!completedBooking) {
      return res.status(403).json({ error: 'You can only review properties you have completed a stay at.' });
    }

    // Step D: Prevent duplicate reviews
    const existingReview = await prisma.review.findFirst({
      where: {
        listingId: listingId,
        userId: req.user.id
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this property.' });
    }

    // Step E: Create the Review
    const newReview = await prisma.review.create({
      data: {
        rating: numRating,
        comment: comment,
        userId: req.user.id,
        listingId: listingId
      },
      include: {
        user: {
          select: {
            firstName: true,
            profileImage: true
          }
        }
      }
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Failed to create review:', error);
    res.status(500).json({ error: 'Internal system error while submitting the review.' });
  }
});

export default router;