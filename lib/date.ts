export function getValentineDate(): Date {
  const now = new Date();
  const year = now.getFullYear();
  const nextValentine = new Date(year, 1, 14, 0, 0, 0, 0);

  // Always target the next upcoming Feb 14.
  if (now.getTime() >= nextValentine.getTime()) {
    nextValentine.setFullYear(year + 1);
  }

  return nextValentine;
}

// Temporary preview switch: set to false to enforce the Feb 14 lock again.
const TEMPORARY_PREVIEW_ACCESS = false;

export function isUnlockedByDate(): boolean {
  if (TEMPORARY_PREVIEW_ACCESS) {
    return true;
  }
  const now = new Date();
  const thisYearValentine = new Date(now.getFullYear(), 1, 14, 0, 0, 0, 0);
  return now.getTime() >= thisYearValentine.getTime();
}
