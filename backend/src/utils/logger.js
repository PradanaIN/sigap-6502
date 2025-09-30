const fs = require('fs');
const path = require('path');
const { createLogger, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { getCurrentLogTimestamp } = require('./time');

function setupLogger(name) {
  const logDir = path.join(__dirname, '..', '..', 'logs');
  fs.mkdirSync(logDir, { recursive: true });

  return createLogger({
    level: 'info',
    format: format.combine(
      format.printf(({ level, message }) => {
        const timestamp = getCurrentLogTimestamp();
        return `[${timestamp}] ${level.toUpperCase()} - ${message}`;
      })
    ),
    transports: [
      new DailyRotateFile({
        filename: path.join(logDir, `${name}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
}

module.exports = { setupLogger };
