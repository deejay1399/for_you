export function getValentineDate(): Date {
  const year = new Date().getFullYear();
  return new Date(year, 1, 14, 0, 0, 0, 0);
}

// Temporary preview switch: set to false to enforce the Feb 14 lock again.
const TEMPORARY_PREVIEW_ACCESS = true;

export function isUnlockedByDate(): boolean {
  if (TEMPORARY_PREVIEW_ACCESS) {
    return true;
  }
  return new Date().getTime() >= getValentineDate().getTime();
}
