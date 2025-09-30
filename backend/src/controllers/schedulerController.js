const fs = require('fs');
const path = require('path');
const { runDailyJob, cancelJob, forceReschedule } = require('../jobs/dailyJob');
const { getSchedule } = require('../services/scheduleService');
const { LOG_AUDIENCES } = require('./logController');

let schedulerActive = false;
let scheduleWatcher = null;

function getSchedulePath() {
  return path.join(__dirname, '..', '..', 'storage', 'schedule-config.json');
}

async function watchScheduleFile(addLog) {
  const schedulePath = getSchedulePath();

  if (scheduleWatcher) {
    scheduleWatcher.close();
  }

  try {
    await getSchedule();
    scheduleWatcher = fs.watch(schedulePath, { persistent: false }, () => {
      addLog('[Scheduler] Perubahan jadwal terdeteksi. Menyusun ulang job.', {
        audience: LOG_AUDIENCES.PUBLIC,
      });
      forceReschedule('file-watch');
    });
  } catch (err) {
    addLog(`[Scheduler] Tidak dapat memantau file jadwal: ${err.message}`, {
      audience: LOG_AUDIENCES.PUBLIC,
    });
  }
}

function startScheduler(client, addLog) {
  const wasActive = schedulerActive;

  if (!schedulerActive) {
    schedulerActive = true;
    addLog('[Scheduler] Menyalakan scheduler harian dinamis...', {
      audience: LOG_AUDIENCES.PUBLIC,
    });
    watchScheduleFile(addLog);
  } else {
    addLog('[Scheduler] Scheduler sudah aktif. Memperbarui referensi client.', {
      audience: LOG_AUDIENCES.PUBLIC,
    });
  }

  runDailyJob(client, addLog, { bootstrap: !wasActive }).catch((err) => {
    addLog(`[Scheduler] Gagal memulai job harian: ${err.message}`, {
      audience: LOG_AUDIENCES.PUBLIC,
    });
  });
}

function stopScheduler(addLog) {
  if (!schedulerActive) {
    addLog('[Scheduler] Tidak ada scheduler aktif.', {
      audience: LOG_AUDIENCES.PUBLIC,
    });
    return;
  }

  schedulerActive = false;
  if (scheduleWatcher) {
    scheduleWatcher.close();
    scheduleWatcher = null;
  }

  cancelJob();
  addLog('[Scheduler] Scheduler dihentikan.', {
    audience: LOG_AUDIENCES.PUBLIC,
  });
}

module.exports = {
  startScheduler,
  stopScheduler,
  forceReschedule,
};
