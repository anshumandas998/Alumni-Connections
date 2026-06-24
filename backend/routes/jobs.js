import express from 'express';
import Job from '../models/Job.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { logAction } from '../middleware/audit.js';

const router = express.Router();

router.use(verifyToken);

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'admin') {
      query.postedBy = req.user.id;
    }
    const jobs = await Job.find(query).populate('postedBy', 'name username').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/jobs
router.post('/', logAction('create', 'job'), async (req, res) => {
  try {
    const jobData = { ...req.body, postedBy: req.user.id };
    const job = new Job(jobData);
    await job.save();
    const populatedJob = await Job.findById(job._id).populate('postedBy', 'name username');
    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/jobs/:id - Super Admin only
router.put('/:id', requireRole(['superadmin']), logAction('update', 'job'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('postedBy', 'name username');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/jobs/:id - Super Admin only
router.delete('/:id', requireRole(['superadmin']), logAction('delete', 'job'), async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

