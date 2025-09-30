const session = require('express-session');
const config = require('../config/env');

function createSessionMiddleware() {
  if (!config.sessionSecret) throw new Error('SESSION_SECRET');
  return session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: 'session',
    proxy: true,                   
    cookie: {
      secure: 'auto',              
      sameSite: 'none',
      httpOnly: true,
      path: '/',
    },
  });
}
module.exports = { createSessionMiddleware };
