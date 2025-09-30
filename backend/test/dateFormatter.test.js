const test = require('node:test');
const assert = require('node:assert/strict');
const moment = require('moment-timezone');

const { formatDateLabels } = require('../src/utils/dateFormatter');

test('formatDateLabels returns Indonesian admin and public labels with timezone abbreviation', () => {
  const timezone = 'Asia/Makassar';
  const baseMoment = moment.tz('2025-09-23T08:15:30', timezone);

  const { adminLabel, publicLabel } = formatDateLabels(baseMoment, timezone);

  assert.equal(adminLabel, '23-09-2025 Pukul 08:15:30 WITA');
  assert.equal(publicLabel, 'Selasa, 23-09-2025 Pukul 08:15:30 WITA');
});

test('formatDateLabels ensures Indonesian locale remains active', () => {
  const timezone = 'Asia/Jayapura';
  const baseMoment = moment.tz('2025-09-24T09:00:00', 'UTC');

  const { adminLabel, publicLabel } = formatDateLabels(baseMoment, timezone);

  assert.match(adminLabel, /Pukul/);
  assert.match(publicLabel, /^Rabu, /);
  assert.equal(moment.locale(), 'id');
});
