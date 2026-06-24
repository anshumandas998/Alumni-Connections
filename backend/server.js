import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import adminsRoutes from './routes/admins.js';
import auditRoutes from './routes/audit.js';
import settingsRoutes from './routes/settings.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Seed superadmin if none exist
import User from './models/User.js';

const seedSuperAdmin = async () => {
  try {
    // Only attempt seeding if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('ℹ️ Skipping seed: MongoDB not connected');
      return;
    }
    const superCount = await User.countDocuments({ role: 'superadmin' });
    if (superCount === 0) {
      const password = 'super123';  // Change this!
      const superAdmin = new User({
        username: 'superadmin',
        email: 'superadmin@alumni.com',
        password,
        name: 'Super Admin',
        role: 'superadmin'
      });
      await superAdmin.save();
      console.log('🔑 SuperAdmin seeded: username/email=superadmin / superadmin@alumni.com / super123');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/alumni', (await import('./routes/alumni.js')).default);
app.use('/api/events', (await import('./routes/events.js')).default);
app.use('/api/jobs', (await import('./routes/jobs.js')).default);
app.use('/api/stats', (await import('./routes/stats.js')).default);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Connect DB & Start
const startServer = async () => {
  await connectDB();
  await seedSuperAdmin();
  const server = app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  });
  
  // Keep the process alive
  const keepAlive = setInterval(() => {}, 1000000);
  
  process.on('SIGINT', () => {
    clearInterval(keepAlive);
    server.close();
    process.exit();
  });
};

startServer();

export default app;

