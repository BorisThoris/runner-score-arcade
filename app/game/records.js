const KEY = 'runner-score-records-v1';
export function readRecords(storage) {
  try {
    const value = JSON.parse(storage.getItem(KEY) || '[]');
    return (Array.isArray(value) ? value : []).filter(row => row && Number.isFinite(row.score) && row.score >= 0 && Number.isFinite(row.seconds) && row.seconds >= 0)
      .sort((a, b) => b.score - a.score).slice(0, 5);
  } catch (_) { return []; }
}
export function saveRun(storage, score, seconds) {
  const records = readRecords(storage);
  records.push({ score: Math.floor(score), seconds: Math.floor(seconds) });
  records.sort((a, b) => b.score - a.score);
  const best = records.slice(0, 5);
  let saved = true;
  try { storage.setItem(KEY, JSON.stringify(best)); } catch (_) { saved = false; }
  return { records: best, saved };
}
