import express from 'express';
import SystemSetting from '../models/SystemSetting.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { logAction } from '../middleware/audit.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRole(['superadmin']));

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/settings - Update or create
router.post('/', logAction('update', 'setting'), async (req, res) => {
  try {
    const { key, value, description } = req.body;
    const setting = await SystemSetting.findOneAndUpdate(
      { key },
      { value, description },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
