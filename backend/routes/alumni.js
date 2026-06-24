import express from 'express';
import Alumni from '../models/Alumni.js';
import { verifyToken, requireRole, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

// GET /api/alumni - List all (permission checked)
router.get('/', requirePermission('alumni', ['read']), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const alumni = await Alumni.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const total = await Alumni.countDocuments(query);
    res.json({ alumni, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/alumni - Create
router.post('/', requirePermission('alumni', ['create']), async (req, res) => {
  try {
    const alumni = new Alumni(req.body);
    await alumni.save();
    res.status(201).json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/alumni/:id - Update
router.put('/:id', requirePermission('alumni', ['update']), async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/alumni/:id
router.delete('/:id', requirePermission('alumni', ['delete']), async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

