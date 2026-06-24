import express from 'express';
import Alumni from '../models/Alumni.js';
import Event from '../models/Event.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const [alumniCount, eventCount, jobCount, adminCount, totalUsers] = await Promise.all([
      Alumni.countDocuments().catch(() => 0),
      Event.countDocuments().catch(() => 0),
      Job.countDocuments().catch(() => 0),
      User.countDocuments({ role: { $in: ['admin', 'superadmin'] } }).catch(() => 1), // At least one admin
      User.countDocuments().catch(() => 1)
    ]);

    res.json({
      alumni: alumniCount,
      events: eventCount,
      jobs: jobCount,
      admins: adminCount,
      totalUsers,
      recentAlumni: await Alumni.find().sort({ createdAt: -1 }).limit(5).catch(() => []),
      upcomingEvents: await Event.find().sort({ date: 1 }).limit(3).catch(() => [])
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

