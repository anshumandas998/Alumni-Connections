import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-now';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // { id, email, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requirePermission = (resource, actions) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No token' });
    }

    const user = await User.findById(req.user.id).select('permissions role');
    req.fullUser = user;

    // Superadmin bypass
    if (user.role === 'superadmin') {
      return next();
    }

    // Check permissions
    const permission = user.permissions?.find(p => p.resource === resource);
    if (!permission || !actions.some(action => permission.actions.includes(action))) {
      return res.status(403).json({ message: `No permission for ${resource}:${actions.join(',')}` });
    }

    next();
  };
};

export const requireRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    const user = await User.findById(req.user.id).select('permissions username');
    req.fullUser = user;
    next();
  };
};

// Role helpers
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super Admin only' });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

