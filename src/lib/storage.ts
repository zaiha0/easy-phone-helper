import type { Guardian, UserSettings, HelpRequestLog } from '../types';

const KEYS = {
  GUARDIAN: 'easyphone_guardian',
  SETTINGS: 'easyphone_settings',
  HELP_LOGS: 'easyphone_help_logs',
} as const;

export function getGuardian(): Guardian | null {
  try {
    const raw = localStorage.getItem(KEYS.GUARDIAN);
    return raw ? (JSON.parse(raw) as Guardian) : null;
  } catch {
    return null;
  }
}

export function setGuardian(guardian: Guardian): void {
  localStorage.setItem(KEYS.GUARDIAN, JSON.stringify(guardian));
}

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    return raw ? (JSON.parse(raw) as UserSettings) : { fontSize: 'normal', contrastMode: false };
  } catch {
    return { fontSize: 'normal', contrastMode: false };
  }
}

export function setSettings(settings: UserSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export function addHelpLog(log: Omit<HelpRequestLog, 'id' | 'createdAt'>): void {
  try {
    const raw = localStorage.getItem(KEYS.HELP_LOGS);
    const logs: HelpRequestLog[] = raw ? JSON.parse(raw) : [];
    const newLog: HelpRequestLog = {
      ...log,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStorage.setItem(KEYS.HELP_LOGS, JSON.stringify(logs.slice(0, 20)));
  } catch {
    // storage 실패는 조용히 무시
  }
}
