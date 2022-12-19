export function getTimestampByDate(date: string): number {
  return new Date(date).getTime();
}
