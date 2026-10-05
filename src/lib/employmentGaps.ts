const DAY = 24 * 60 * 60 * 1000;
/** Gaps shorter than this are normal job-change time, not something to flag. */
const SLACK_DAYS = 31;

export interface EmploymentSpan {
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Gap {
  from: Date;
  to: Date;
}

const parse = (iso: string) => (iso ? new Date(`${iso}T00:00:00`) : null);

/** Finds stretches inside the last `years` years that no listed employer covers. */
export function findGaps(spans: EmploymentSpan[], years = 3, today = new Date()): Gap[] {
  const windowStart = new Date(today.getTime() - years * 365 * DAY);
  const intervals = spans
    .map((s) => ({ start: parse(s.startDate), end: s.current ? today : parse(s.endDate) }))
    .filter((i): i is { start: Date; end: Date } => !!i.start && !!i.end && i.end >= i.start)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  if (intervals.length === 0) return [];

  const gaps: Gap[] = [];
  let cursor = windowStart;
  for (const { start, end } of intervals) {
    if (start.getTime() - cursor.getTime() > SLACK_DAYS * DAY) gaps.push({ from: cursor, to: start });
    if (end > cursor) cursor = end;
  }
  if (today.getTime() - cursor.getTime() > SLACK_DAYS * DAY) gaps.push({ from: cursor, to: today });
  return gaps;
}
