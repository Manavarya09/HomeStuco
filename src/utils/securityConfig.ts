export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
  AUTO_LOGOUT_WARNING: 5 * 60 * 1000,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_COOLDOWN: 15 * 60 * 1000,
  ENABLE_SESSION_REFRESH: true,
  ENABLE_AUTO_LOGOUT: true,
  SECURE_STORAGE: true,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
} as const;

export const SecurityUtils = {
  generateSessionToken(): string {
    const timestamp = Date.now();
    const randomValue = Math.random().toString(36).substring(2);
    return btoa(`${timestamp}-${randomValue}`);
  },
  obfuscate(data: string): string {
    if (!SECURITY_CONFIG.ENABLE_DEBUG_LOGS) {
      return '*'.repeat(data.length);
    }
    return data;
  },
  clearSensitiveData(): void {
    if ('gc' in window) {
      (window as any).gc();
    }
  },
  isSecureContext(): boolean {
    return window.isSecureContext || location.protocol === 'https:';
  },
};

export const getSecurityStatus = () => ({
  isAuthenticated: !!localStorage.getItem('adminAuthenticated'),
  hasValidSession: !!localStorage.getItem('adminSession'),
  isSecureContext: SecurityUtils.isSecureContext(),
  sessionAge: Date.now() - parseInt(localStorage.getItem('adminSession') || '0'),
  timeUntilExpiry: SECURITY_CONFIG.SESSION_TIMEOUT - (Date.now() - parseInt(localStorage.getItem('adminSession') || '0')),
});
