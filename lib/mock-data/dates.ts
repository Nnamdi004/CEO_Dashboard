// Fixed anchor so mock data is deterministic across server/client renders
// (no Date.now()/Math.random() in generated data — avoids hydration mismatches).
export const TODAY = new Date("2026-07-31T00:00:00.000Z");

export function daysAgo(n: number): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export function daysFromNow(n: number): string {
  return daysAgo(-n);
}
