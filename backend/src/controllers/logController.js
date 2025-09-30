const { setupLogger } = require("../utils/logger");
const { getCurrentLogTimestamp } = require("../utils/time");
const { emitLogUpdate } = require("../utils/socketHandler");

const logger = setupLogger("app");

const LOG_AUDIENCES = {
  ADMIN: "admin",
  PUBLIC: "public",
};

const MAX_LOG_ENTRIES = 100;
const logs = [];

function resolveArgs(levelOrOptions, maybeOptions) {
  if (levelOrOptions && typeof levelOrOptions === "object" && !Array.isArray(levelOrOptions)) {
    return { level: "info", metadata: levelOrOptions };
  }

  return {
    level: typeof levelOrOptions === "string" ? levelOrOptions : "info",
    metadata:
      maybeOptions && typeof maybeOptions === "object" && !Array.isArray(maybeOptions)
        ? maybeOptions
        : {},
  };
}

function addLog(text, levelOrOptions = "info", maybeOptions) {
  const { level, metadata } = resolveArgs(levelOrOptions, maybeOptions);
  const audience = metadata.audience === LOG_AUDIENCES.PUBLIC ? LOG_AUDIENCES.PUBLIC : LOG_AUDIENCES.ADMIN;

  const time = getCurrentLogTimestamp();
  const line = `[${time}] ${text}`;

  if (logs.length >= MAX_LOG_ENTRIES) {
    logs.shift();
  }

  logs.push({ line, audience });
  console.log(line);

  switch (level) {
    case "error":
      logger.error(text);
      break;
    case "warn":
      logger.warn(text);
      break;
    default:
      logger.info(text);
  }

  emitLogUpdate(line, audience);
}

function getLogs(limit = 100, audience = LOG_AUDIENCES.PUBLIC) {
  const normalized = audience === LOG_AUDIENCES.ADMIN ? LOG_AUDIENCES.ADMIN : LOG_AUDIENCES.PUBLIC;
  const filtered =
    normalized === LOG_AUDIENCES.ADMIN
      ? logs
      : logs.filter((entry) => entry.audience === LOG_AUDIENCES.PUBLIC);

  return filtered.slice(-limit).map((entry) => entry.line);
}

module.exports = { addLog, getLogs, LOG_AUDIENCES };
