const config = require('../config/env');

const HEADER_NAME = 'x-api-key';

function extractKey(req) {
  const headerKey = req.get(HEADER_NAME);
  if (headerKey) {
    return headerKey.trim();
  }

  const authHeader = req.get('authorization');
  if (!authHeader) {
    return null;
  }

  const trimmedAuth = authHeader.trim();
  if (!trimmedAuth) {
    return null;
  }

  const [scheme, token] = trimmedAuth.split(/\s+/, 2);
  if (scheme && scheme.toLowerCase() === 'bearer' && token) {
    return token.trim();
  }

  return trimmedAuth;
}

module.exports = function apiKeyAuth(req, res, next) {
  const expectedKey = config.apiKeys.control.trim();

  if (!expectedKey) {
    console.error(
      '[Auth] API key middleware aktif tetapi variabel lingkungan CONTROL_API_KEY/API_KEY belum diset.'
    );
    return res
      .status(500)
      .json({ message: 'API key server belum dikonfigurasi.' });
  }

  const providedKey = extractKey(req);

  if (!providedKey) {
    return res
      .status(401)
      .json({ message: 'API key diperlukan untuk mengakses endpoint ini.' });
  }

  if (providedKey !== expectedKey) {
    return res.status(403).json({ message: 'API key tidak valid.' });
  }

  return next();
};
