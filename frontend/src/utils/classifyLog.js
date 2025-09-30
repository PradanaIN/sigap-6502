export function classifyLog(line) {
  if (/\[Message\]/i.test(line)) return "message";
  if (/\[Scheduler\]/i.test(line)) return "scheduler";
  if (/\[Heartbeat\]/i.test(line)) return "heartbeat";
  if (/\[Quote\]/i.test(line)) return "quote";
  if (/\[(System|Sistem)\]/i.test(line)) return "system";
  if (/\[KeepAlive\]/i.test(line)) return "keepalive";
  if (/\[Auth\]/i.test(line)) return "auth";
  if (/\[Bot\]/i.test(line)) return "bot";
  return "default";
}
