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
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Profile update execution failed:', error);
    res.status(500).json({ error: 'Failed to accurately update profile database properties.' });
  }
});

export default router;