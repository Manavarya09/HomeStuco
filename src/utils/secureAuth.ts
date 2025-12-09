// Secure authentication utilities - Final Production Version

// Read credentials from environment (Vite exposes VITE_* only)
const envUser = import.meta.env.VITE_ADMIN_USERNAME || '';
const envPass = import.meta.env.VITE_ADMIN_PASSWORD || '';

// Secure credential validation (obfuscated for basic deterrence)
const SECURE_CREDENTIALS = {
  u: envUser ? btoa(envUser) : '',
  p: envPass ? btoa(envPass) : '',
};

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

// Validate credentials securely
export const validateCredentials = async (username: string, password: string): Promise<boolean> => {
  try {
    // Add artificial delay to reduce timing signals
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    // Ensure env credentials are configured
    if (!SECURE_CREDENTIALS.u || !SECURE_CREDENTIALS.p) {
      return false;
    }

    const validUsername = atob(SECURE_CREDENTIALS.u);
    const validPassword = atob(SECURE_CREDENTIALS.p);

    return username === validUsername && password === validPassword;
  } catch (error) {
    return false;
  }
};

export class SecureAuth {
  private static readonly TOKEN_KEY = 'adminToken';
  private static readonly AUTH_KEY = 'adminAuthenticated';
  private static readonly SESSION_KEY = 'adminSession';
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  // Check if user is authenticated with session validation
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const isAuth = localStorage.getItem(this.AUTH_KEY) === 'true';
    const sessionStart = localStorage.getItem(this.SESSION_KEY);
    
    if (!token || !isAuth || !sessionStart) {
      return false;
    }

    // Check session timeout
    const sessionAge = Date.now() - parseInt(sessionStart);
    if (sessionAge > this.SESSION_TIMEOUT) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Get authentication token for API requests
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Logout and clear all auth data
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Refresh session timestamp
  static refreshSession(): void {
    if (this.isAuthenticated()) {
      localStorage.setItem(this.SESSION_KEY, Date.now().toString());
    }
  }
}

// Environment-based configuration
export const AUTH_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  ENABLE_LOGGING: import.meta.env.DEV || false,
};
