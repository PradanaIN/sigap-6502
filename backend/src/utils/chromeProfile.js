const fs = require("fs");
const path = require("path");

function getSessionsBaseDir() {
  return path.join(__dirname, "..", "..", "storage", "sessions");
}

function getDefaultProfileDir() {
  return path.join(getSessionsBaseDir(), "session");
}

function cleanupWwebjsProfileLocks() {
  try {
    const profileDir = getDefaultProfileDir();
    const candidates = [
      path.join(profileDir, "SingletonLock"),
      path.join(profileDir, "SingletonCookie"),
      path.join(profileDir, "SingletonSocket"),
      path.join(profileDir, "DevToolsActivePort"),
    ];

    let removed = false;
    for (const f of candidates) {
      try {
        if (fs.existsSync(f)) {
          fs.rmSync(f, { force: true });
          removed = true;
        }
      } catch (_) {
        // ignore per-file errors
      }
    }

    return removed;
  } catch (_) {
    return false;
  }
}

module.exports = {
  getSessionsBaseDir,
  getDefaultProfileDir,
  cleanupWwebjsProfileLocks,
};
