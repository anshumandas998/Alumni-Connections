import express from 'express';
const User = require('../models/UserMySQL.js');
import SystemSetting from '../models/SystemSetting.js';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const query = username ? { username } : { email };
    
    // Fallback login for SuperAdmin if DB is down or empty
    if ((username === 'superadmin' || email === 'superadmin@alumni.com') && password === 'super123') {
      const token = jwt.sign(
        { id: 'super-admin-id', username: 'superadmin', email: 'superadmin@alumni.com', role: 'superadmin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        token,
        user: { id: 'super-admin-id', username: 'superadmin', email: 'superadmin@alumni.com', name: 'Super Admin', role: 'superadmin' }
      });
    }

    const user = await User.findOne(query);
    if (!user || !await user.matchPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/register (for regular/alumni, superadmin separate)
router.post('/register', async (req, res) => {
  try {
    const registrationSetting = await SystemSetting.findOne({ key: 'registration_open' });
    if (registrationSetting && registrationSetting.value === false) {
      return res.status(403).json({ message: 'Registration is currently closed' });
    }

    const { email, password, name, username } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User exists' });
    }

    const user = new User({ 
      email, 
      password, 
      name, 
      username: username || email, // Default to email if no username provided
      role: 'admin' 
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

export default router;

