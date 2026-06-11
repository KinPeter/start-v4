export function metersToKms(meters: number): number {
  return Math.round(meters / 100) / 10;
}

export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 60 / 60) * 10) / 10;
}
