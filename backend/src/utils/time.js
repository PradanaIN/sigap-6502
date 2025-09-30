const moment = require("moment-timezone");
const config = require("../config/env");

const LOG_TIMESTAMP_FORMAT = "DD/MM HH:mm:ss";

function getCurrentLogTimestamp() {
  return moment().tz(config.timezone).format(LOG_TIMESTAMP_FORMAT);
}

module.exports = { LOG_TIMESTAMP_FORMAT, getCurrentLogTimestamp };
