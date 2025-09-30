function attachAuthState(req, res, next) {
  res.locals.isAuthenticated = Boolean(req.session?.isAdmin);
  res.locals.currentUser = res.locals.isAuthenticated
    ? { role: 'admin', username: req.session.username }
    : null;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({ message: 'Login diperlukan untuk mengakses resource ini.' });
  }
  return next();
}

module.exports = {
  attachAuthState,
  requireAdmin,
};
