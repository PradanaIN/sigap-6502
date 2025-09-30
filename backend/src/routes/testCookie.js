const express = require('express');
const router = express.Router();

router.get('/set', (req, res) => {
  res.cookie('probe', 'ok', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.json({ ok: true });
});

module.exports = router;
