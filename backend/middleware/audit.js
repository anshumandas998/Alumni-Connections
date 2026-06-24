import AuditLog from '../models/AuditLog.js';

export const logAction = (action, resource) => {
  return async (req, res, next) => {
    // We'll log after the request is finished successfully
    const originalSend = res.send;
    res.send = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const log = new AuditLog({
          user: req.user.id,
          action,
          resource,
          resourceId: req.params.id || null,
          details: {
            method: req.method,
            path: req.originalUrl,
            body: req.method !== 'GET' ? req.body : undefined
          },
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });
        log.save().catch(err => console.error('Audit Log Error:', err));
      }
      originalSend.apply(res, arguments);
    };
    next();
  };
};
