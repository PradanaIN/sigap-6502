const bcrypt = require('bcryptjs');
const { z } = require('zod');
const config = require('../config/env');

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
  remember: z.boolean().optional(),
});

const REMEMBER_ME_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180;

async function verifyPassword(inputPassword) {
  const { passwordHash, plainPassword } = config.admin;
  if (passwordHash) {
    return bcrypt.compare(inputPassword, passwordHash);
  }

  if (plainPassword) {
    return inputPassword === plainPassword;
  }

  throw new Error(
    'ADMIN_PASSWORD_HASH atau ADMIN_PASSWORD belum dikonfigurasi di environment.'
  );
}

async function establishSession(req, username, options = {}) {
  const remember = Boolean(options.remember);
  await new Promise((resolve, reject) => {
    console.log('[LOGIN] req.secure =', req.secure, 'XFP =', req.get('x-forwarded-proto'));
    req.session.regenerate((err) => {
      if (err) {
        reject(err);
        return;
      }

      req.session.isAdmin = true;
      req.session.username = username;
      req.session.createdAt = new Date().toISOString();
      req.session.cookie.maxAge = remember ? REMEMBER_ME_MAX_AGE_MS : null;

      req.session.save((saveErr) => {
        if (saveErr) {
          reject(saveErr);
        } else {
          resolve();
        }
      });
    });
  });
}

async function handleLogin(req, res, next) {
  try {
    const { username, password, remember } = loginSchema.parse(req.body);
    if (username !== config.admin.username) {
      return res.status(401).json({ message: 'Kredensial tidak valid.' });
    }

    const valid = await verifyPassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Kredensial tidak valid.' });
    }

    await establishSession(req, username, { remember });

    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.json({
      message: 'Login berhasil.',
      user: { username, role: 'admin' },
    });
  } catch (err) {
    next(err);
  }
}

function handleSession(req, res) {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  if (req.session?.isAdmin) {
    return res.json({
      authenticated: true,
      user: { username: req.session.username, role: 'admin' },
    });
  }

  return res.json({ authenticated: false });
}

async function handleLogout(req, res, next) {
  try {
    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.clearCookie('session', { path: '/' });
    res.json({ message: 'Logout berhasil.' });
  } catch (err) {
    next(err);
  }
}

async function renderLogin(req, res) {
  if (req.session?.isAdmin) {
    res.redirect('/admin/dashboard');
    return;
  }

  res.render('auth/login', { error: null, values: { username: config.admin.username } });
}

async function handleLoginForm(req, res) {
  try {
    const { username, password, remember } = loginSchema.parse(req.body);
    const validUser = username === config.admin.username;
    const validPassword = validUser ? await verifyPassword(password) : false;

    if (!validUser || !validPassword) {
      res.render('auth/login', {
        error: 'Kombinasi username/password salah.',
        values: { username },
      });
      return;
    }

    await establishSession(req, username, { remember });
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.render('auth/login', {
      error: err.message,
      values: { username: req.body?.username || '' },
    });
  }
}

async function handleLogoutWeb(req, res) {
  await new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  res.clearCookie('session', { path: '/' });
  res.redirect('/admin/login');
}

module.exports = {
  handleLogin,
  handleLogout,
  handleSession,
  renderLogin,
  handleLoginForm,
  handleLogoutWeb,
};
