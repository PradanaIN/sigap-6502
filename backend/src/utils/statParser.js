const fs = require("fs");
const path = require("path");
const readline = require("readline");
const moment = require("moment-timezone");

const config = require("../config/env");
const { LOG_TIMESTAMP_FORMAT } = require("./time");

const LOG_LINE_REGEX = /^\[(\d{2}\/\d{2} \d{2}:\d{2}:\d{2})\]\s+([A-Z]+)\s*-\s*(.*)$/;

function getFileDateContext(logFilePath) {
  const fileName = path.basename(logFilePath);
  const match = fileName.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return moment.tz(`${year}-${month}-${day}`, "YYYY-MM-DD", config.timezone);
}

function normalizeYear(parsedMoment, contextMoment) {
  if (!contextMoment) {
    return parsedMoment;
  }

  const updated = parsedMoment.year(contextMoment.year());

  const contextMonth = contextMoment.month();
  const parsedMonth = updated.month();

  if (contextMonth === 11 && parsedMonth === 0) {
    return updated.add(1, "year");
  }

  if (contextMonth === 0 && parsedMonth === 11) {
    return updated.subtract(1, "year");
  }

  return updated;
}

function parseLogLine(line, contextMoment) {
  const match = line.match(LOG_LINE_REGEX);
  if (!match) {
    return null;
  }

  const [, timestampPart, rawLevel, rawMessage] = match;

  let parsedMoment = moment.tz(
    timestampPart,
    LOG_TIMESTAMP_FORMAT,
    true,
    config.timezone
  );

  if (!parsedMoment.isValid()) {
    return null;
  }

  parsedMoment = normalizeYear(parsedMoment, contextMoment);

  if (!parsedMoment.isValid()) {
    return null;
  }

  return {
    date: parsedMoment.toDate(),
    level: rawLevel.toLowerCase(),
    message: rawMessage.trim(),
  };
}

function getDateKey(date) {
  return moment.tz(date, config.timezone).format("YYYY-MM-DD");
}

async function parseLogFilePerDay(logFilePath) {
  const fileStream = fs.createReadStream(logFilePath);
  const rl = readline.createInterface({ input: fileStream });
  const contextMoment = getFileDateContext(logFilePath);

  const messagesPerDay = {};
  const errorsPerDay = {};
  const uptimePerDay = {};

  let currentUptimeStart = null;

  for await (const line of rl) {
    const parsed = parseLogLine(line, contextMoment);

    if (!parsed) {
      continue;
    }

    const { date, level, message } = parsed;
    const dayKey = getDateKey(date);

    if (message.includes("Pesan berhasil dikirim")) {
      messagesPerDay[dayKey] = (messagesPerDay[dayKey] || 0) + 1;
    }

    if (message.includes("❌") || level === "error") {
      errorsPerDay[dayKey] = (errorsPerDay[dayKey] || 0) + 1;
    }

    if (message.includes("[Sistem] ✅ Bot aktif.")) {
      currentUptimeStart = date;
    }

    if (message.includes("[Sistem] 🤖 Bot dinonaktifkan.") && currentUptimeStart) {
      const duration = (date - currentUptimeStart) / (1000 * 60 * 60);
      const key = getDateKey(currentUptimeStart);
      uptimePerDay[key] = (uptimePerDay[key] || 0) + duration;
      currentUptimeStart = null;
    }
  }

  return { messagesPerDay, errorsPerDay, uptimePerDay };
}

module.exports = { parseLogFilePerDay };
