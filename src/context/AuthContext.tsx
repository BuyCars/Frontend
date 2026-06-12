import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  apiGetMe,
  apiLogin,
  apiLogout,
  apiRegister,
  type LoginResponse,
  type RegisterData,
  type UserProfile,
} from '../api/auth';

export interface AuthUser {
  id: number;
  userName: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (credential: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'buycars-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    apiGetMe(token)
      .then((p) => {
        setUser({ id: p.id, userName: p.userName, role: p.role, token });
        setProfile(p);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAuthResponse = async (resp: LoginResponse) => {
    localStorage.setItem(TOKEN_KEY, resp.token);
    const p = await apiGetMe(resp.token);
    setUser({ id: resp.userId, userName: resp.userName, role: resp.role, token: resp.token });
    setProfile(p);
  };

  const login = async (credential: string, password: string) => {
    const resp = await apiLogin(credential, password);
    await handleAuthResponse(resp);
  };

  const register = async (data: RegisterData) => {
    const resp = await apiRegister(data);
    await handleAuthResponse(resp);
  };

  const logout = async () => {
    if (user?.token) {
      await apiLogout(user.token).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
