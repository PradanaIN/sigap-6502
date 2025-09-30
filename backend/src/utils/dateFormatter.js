const moment = require('moment-timezone');
require('moment/locale/id');

moment.locale('id');

function capitalize(label) {
  if (!label) {
    return '';
  }
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const TIMEZONE_ABBREVIATIONS = {
  'Asia/Jakarta': 'WIB',
  'Asia/Pontianak': 'WIB',
  'Asia/Makassar': 'WITA',
  'Asia/Ujung_Pandang': 'WITA',
  'Asia/Jayapura': 'WIT',
};

function resolveTimezoneAbbreviation(zonedMoment, timezone) {
  const directAbbreviation = zonedMoment.format('z');
  if (directAbbreviation && /[A-Za-z]{2,}/.test(directAbbreviation) && directAbbreviation !== 'GMT') {
    return directAbbreviation;
  }

  if (TIMEZONE_ABBREVIATIONS[timezone]) {
    return TIMEZONE_ABBREVIATIONS[timezone];
  }

  return zonedMoment.format('Z');
}

function formatDateLabels(momentInstance, timezone) {
  if (!momentInstance || typeof momentInstance.clone !== 'function') {
    throw new TypeError('A valid moment instance is required');
  }

  if (!timezone || typeof timezone !== 'string') {
    throw new TypeError('A valid timezone string is required');
  }

  const zonedMoment = momentInstance.clone().tz(timezone).locale('id');
  const abbreviation = resolveTimezoneAbbreviation(zonedMoment, timezone);
  const baseFormat = 'DD-MM-YYYY [Pukul] HH:mm:ss';

  return {
    adminLabel: `${zonedMoment.format(baseFormat)} ${abbreviation}`.trim(),
    publicLabel: `${zonedMoment.format(`dddd, ${baseFormat}`)} ${abbreviation}`.trim(),
  };
}

function formatIsoDateId(isoDate, { withWeekday = false } = {}) {
  if (typeof isoDate !== 'string') {
    return isoDate ?? '';
  }

  const trimmed = isoDate.trim();
  if (!trimmed) {
    return isoDate;
  }

  const m = moment(trimmed, 'YYYY-MM-DD', true);
  if (!m.isValid()) {
    return isoDate;
  }

  const base = m.format('DD-MM-YYYY');
  if (!withWeekday) {
    return base;
  }

  const weekday = capitalize(m.format('dddd'));
  return weekday ? `${weekday}, ${base}` : base;
}

module.exports = {
  formatDateLabels,
  formatIsoDateId,
};
