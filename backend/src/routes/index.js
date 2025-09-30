const apiKeyAuth = require('../middleware/apiKeyAuth');
const { requireAdmin } = require('../middleware/adminAuth');

const authRoutes = require('./authRoutes');
const botRoutes = require('./botRoutes');
const messageRoutes = require('./messageRoutes');
const systemRoutes = require('./systemRoutes');
const templateRoutes = require('./templateRoutes');
const scheduleAdminRoutes = require('./scheduleAdminRoutes');
const schedulePublicRoutes = require('./schedulePublicRoutes');
const calendarAdminRoutes = require('./calendarAdminRoutes');
const adminBotRoutes = require('./adminBotRoutes');
const adminContactRoutes = require('./adminContactRoutes');
const webRoutes = require('./webRoutes');
const quotesRoutes = require('./quotesRoutes');
const testCookie = require('./testCookie');

function registerRoutes(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/bot', apiKeyAuth, botRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/system', systemRoutes);
  app.use('/api/templates', apiKeyAuth, templateRoutes);
  app.use('/api/admin/templates', requireAdmin, templateRoutes);
  app.use('/api/admin/bot', requireAdmin, adminBotRoutes);
  app.use('/api/admin/calendar', requireAdmin, calendarAdminRoutes);
  app.use('/api/admin/schedule', requireAdmin, scheduleAdminRoutes);
  app.use('/api/admin/contacts', requireAdmin, adminContactRoutes);
  app.use('/api/quotes', quotesRoutes);
  app.use('/api/schedule', schedulePublicRoutes);
  app.use('/', webRoutes);
  app.use('/api/test-cookie', testCookie);

  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
    }
    return res.status(404).render('404', { title: 'Halaman tidak ditemukan' });
  });

  app.use((err, req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || 'Terjadi kesalahan pada server.';

    if (req.path.startsWith('/api')) {
      return res.status(status).json({ message });
    }

    res.status(status).render('error', {
      title: 'Terjadi Kesalahan',
      message,
      status,
    });
  });
}

module.exports = registerRoutes;
