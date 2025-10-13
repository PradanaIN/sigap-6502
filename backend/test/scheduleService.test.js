const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const fssync = require('node:fs');
const path = require('node:path');
const moment = require('moment-timezone');

const {
  scheduler: { defaultSchedule: DEFAULT_SCHEDULE },
} = require('../src/config/env');

const STORAGE_DIR = path.resolve(__dirname, '..', 'storage');
const CONFIG_PATH = path.join(STORAGE_DIR, 'schedule-config.json');
const TIMEZONE = DEFAULT_SCHEDULE.timezone;
const DEFAULT_SCHEDULE_VERSION = DEFAULT_SCHEDULE.defaultVersion;

let originalSchedule = null;

async function readScheduleFile() {
  const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function seedSchedule(scheduleDocument) {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  await fs.writeFile(
    CONFIG_PATH,
    `${JSON.stringify(scheduleDocument, null, 2)}\n`,
    'utf-8'
  );
}

function loadService() {
  delete require.cache[require.resolve('../src/services/scheduleService')];
  // eslint-disable-next-line global-require
  return require('../src/services/scheduleService');
}

test.before(async () => {
  if (fssync.existsSync(CONFIG_PATH)) {
    originalSchedule = await fs.readFile(CONFIG_PATH, 'utf-8');
  }
});

test.after(async () => {
  if (originalSchedule !== null) {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.writeFile(CONFIG_PATH, originalSchedule, 'utf-8');
  } else if (fssync.existsSync(CONFIG_PATH)) {
    await fs.unlink(CONFIG_PATH);
  }
});

function buildReference(dateString) {
  return moment.tz(`${dateString} 09:00`, 'YYYY-MM-DD HH:mm', TIMEZONE);
}

test('returns default run times for the latest schedule version', async (t) => {
  const scheduleDocument = {
    timezone: TIMEZONE,
    dailyTimes: { ...DEFAULT_SCHEDULE.dailyTimes },
    manualOverrides: [],
    paused: false,
    lastUpdatedAt: new Date('2024-05-01T00:00:00Z').toISOString(),
    updatedBy: 'system',
    defaultVersion: DEFAULT_SCHEDULE_VERSION,
  };

  await seedSchedule(scheduleDocument);
  const { getNextRun, getSchedule } = loadService();

  const weekdayCases = [
    { label: 'Monday', date: '2024-07-01', key: '1' },
    { label: 'Tuesday', date: '2024-07-02', key: '2' },
    { label: 'Wednesday', date: '2024-07-03', key: '3' },
    { label: 'Thursday', date: '2024-07-04', key: '4' },
    { label: 'Friday', date: '2024-07-05', key: '5' },
  ];

  for (const { label, date, key } of weekdayCases) {
    const expected = DEFAULT_SCHEDULE.dailyTimes[key];
    // eslint-disable-next-line no-await-in-loop
    await t.test(`maps ${label} to ${expected} WITA`, async () => {
      const referenceMoment = buildReference(date);
      const nextRun = await getNextRun({ referenceMoment });

      assert.ok(nextRun, `expected next run information for ${label}`);
      assert.equal(
        nextRun.targetMoment.clone().tz(TIMEZONE).format('HH:mm'),
        expected
      );
      assert.equal(nextRun.targetMoment.tz(TIMEZONE).isoWeekday(),
        moment.tz(date, 'YYYY-MM-DD', TIMEZONE).isoWeekday());
    });
  }

  const sanitized = await getSchedule();
  assert.equal(sanitized.dailyTimes['6'], null);
  assert.equal(sanitized.dailyTimes['7'], null);
});


test('auto-upgrades legacy schedules to the latest default times', async (t) => {
  const legacyDocument = {
    timezone: TIMEZONE,
    dailyTimes: {
      1: '15:45',
      2: '15:45',
      3: '15:45',
      4: '15:45',
      5: '16:00',
      6: null,
      7: null,
    },
    manualOverrides: [],
    paused: false,
    lastUpdatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedBy: 'system',
    // intentionally omit defaultVersion to mimic legacy files
  };

  await seedSchedule(legacyDocument);
  const { getNextRun, getSchedule } = loadService();

  const upgraded = await getSchedule();
  assert.equal(upgraded.defaultVersion, DEFAULT_SCHEDULE_VERSION);
  assert.deepEqual(upgraded.dailyTimes, DEFAULT_SCHEDULE.dailyTimes);

  const persisted = await readScheduleFile();
  assert.equal(persisted.defaultVersion, DEFAULT_SCHEDULE_VERSION);
  assert.deepEqual(persisted.dailyTimes, upgraded.dailyTimes);

  const mondayRun = await getNextRun({
    referenceMoment: buildReference('2024-07-01'),
  });
  assert.equal(
    mondayRun.targetMoment.clone().tz(TIMEZONE).format('HH:mm'),
    DEFAULT_SCHEDULE.dailyTimes['1']
  );

  const fridayRun = await getNextRun({
    referenceMoment: buildReference('2024-07-05'),
  });
  assert.equal(
    fridayRun.targetMoment.clone().tz(TIMEZONE).format('HH:mm'),
    DEFAULT_SCHEDULE.dailyTimes['5']
  );
});
