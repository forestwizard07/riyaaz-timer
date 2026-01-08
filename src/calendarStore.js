const STORAGE_KEY = "riyaaz_practice_log";

export function getPracticeLog() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

export function addPracticeMinutes(minutes) {
  const log = getPracticeLog();

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  log[today] = (log[today] || 0) + minutes;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
}

export function clearPracticeForDate(dateKey) {
  const log = getPracticeLog();

  if (log[dateKey]) {
    delete log[dateKey];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  }
}