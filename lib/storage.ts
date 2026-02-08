"use client";

import { STORAGE_KEYS } from "@/lib/constants";

export function getPasscodeVerified(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(STORAGE_KEYS.passcodeVerified) === "true";
}

export function setPasscodeVerified(value: boolean): void {
  localStorage.setItem(STORAGE_KEYS.passcodeVerified, String(value));
}

export function getMusicEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(STORAGE_KEYS.musicEnabled) === "true";
}

export function setMusicEnabled(value: boolean): void {
  localStorage.setItem(STORAGE_KEYS.musicEnabled, String(value));
}

export function getResponse(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(STORAGE_KEYS.response);
}

export function setResponse(value: string): void {
  localStorage.setItem(STORAGE_KEYS.response, value);
}
