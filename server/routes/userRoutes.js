// server/routes/userRoutes.js

import express from 'express';
import { prisma } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// 1. Fetch Profile Data
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        bio: true,
        location: true,
        createdAt: true,
        wishlistIds: true, // <-- Ensure this is fetched too
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile extraction failed:', error);
    res.status(500).json({ error: 'Failed to access profile data records.' });
  }
});

// 2. Update Profile Data (Accepts Optional Single Image Upload)
router.put('/profile', verifyToken, upload.single('profileImage'), async (req, res) => {
  try {
    const { bio, location, firstName, lastName } = req.body;
    let profileImageUrl = undefined;

    if (req.file) {
      profileImageUrl = await uploadToCloudinary(req.file.buffer, 'airbnb_profiles');
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        bio: bio !== undefined ? bio : undefined,
        location: location !== undefined ? location : undefined,
        profileImage: profileImageUrl || undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        bio: true,
        location: true,
        wishlistIds: true, // <-- Included here too
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Profile update execution failed:', error);
    res.status(500).json({ error: 'Internal system error during profile update.' });
  }
});

// 3. Toggle Wishlist (Add/Remove)
router.patch('/:userId/wishlist', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { listingId } = req.body;

    if (req.user.id !== userId) return res.status(403).json({ error: "Unauthorized access" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // NEW: Fetch the listing and prevent hosts from wishlisting their own property
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    
    if (listing.hostId === userId) {
      return res.status(400).json({ error: "You cannot wishlist your own property." });
    }

    let updatedWishlist = [...(user.wishlistIds || [])];

    if (updatedWishlist.includes(listingId)) {
      updatedWishlist = updatedWishlist.filter(id => id !== listingId); // Remove
    } else {
      updatedWishlist.push(listingId); // Add
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { wishlistIds: updatedWishlist }
    });

    res.status(200).json({ wishlistIds: updatedUser.wishlistIds });
  } catch (error) {
    console.error("Wishlist Toggle Error:", error);
    res.status(500).json({ error: "Internal system error" });
  }
});

// 4. Get User's Saved Wishlist
router.get('/:userId/wishlist', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId) return res.status(403).json({ error: "Unauthorized access" });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    const wishlistedListings = await prisma.listing.findMany({
      where: { id: { in: user.wishlistIds || [] } },
      include: {
        images: { where: { isCover: true }, take: 1 },
        reviews: { select: { rating: true } }
      }
    });

    const formattedListings = wishlistedListings.map(listing => {
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
    console.error("Fetch Wishlist Error:", error);
    res.status(500).json({ error: "Internal system error" });
  }
});

export default router;