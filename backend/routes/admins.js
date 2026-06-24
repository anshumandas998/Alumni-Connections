import express from 'express';
import User from '../models/User.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { logAction } from '../middleware/audit.js';

const router = express.Router();

// All routes superadmin only
router.use(verifyToken);
router.use(requireRole(['superadmin']));

// GET /api/admins - List admins
router.get('/', async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admins - Create admin
router.post('/', logAction('create', 'admin'), async (req, res) => {
  try {
    const { email, password, name, permissions = [] } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email taken' });

    const admin = new User({ email, password, name, role: 'admin', permissions });
    await admin.save();

    const populated = await User.findById(admin._id).select('-password');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admins/:id - Update
router.put('/:id', logAction('update', 'admin'), async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    Object.assign(admin, req.body);
    if (req.body.password) admin.password = req.body.password;  // Will hash
    await admin.save();

    const updated = await User.findById(admin._id).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admins/:id
router.delete('/:id', logAction('delete', 'admin'), async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

