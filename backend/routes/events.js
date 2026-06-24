import express from 'express';
import Event from '../models/Event.js';
import { verifyToken, requireRole, requirePermission } from '../middleware/auth.js';
import { logAction } from '../middleware/audit.js';

const router = express.Router();

router.use(verifyToken);

// GET /api/events
router.get('/', requirePermission('events', ['read']), async (req, res) => {
  try {
    const events = await Event.find().populate('organizer attendees', 'name email').sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/events
router.post('/', requirePermission('events', ['create']), logAction('create', 'event'), async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/events/:id
router.put('/:id', requirePermission('events', ['update']), logAction('update', 'event'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', requirePermission('events', ['delete']), logAction('delete', 'event'), async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

