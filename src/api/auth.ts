// Change this if your backend runs on a different port
const API_BASE = 'http://localhost:5000/api';

// Set to true to test without a real backend
const MOCK_MODE = true;

export interface LoginResponse {
  status: boolean;
  statusMsg: string;
  token: string;
  role: string;
  userId: number;
  userName: string;
}

export interface UserProfile {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  registeredOn?: string;
  lastLogin?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phone: string;
}

// ─── Mock storage ────────────────────────────────────────────────────────────

const MOCK_USERS_KEY = 'mock_users';
const MOCK_TOKEN_MAP_KEY = 'mock_token_map';

function getMockUsers(): UserProfile[] {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) ?? '[]') as UserProfile[];
  } catch {
    return [];
  }
}

function saveMockUsers(users: UserProfile[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function getTokenMap(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(MOCK_TOKEN_MAP_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function saveTokenMap(map: Record<string, number>) {
  localStorage.setItem(MOCK_TOKEN_MAP_KEY, JSON.stringify(map));
}

function makeToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

// ─── Mock implementations ─────────────────────────────────────────────────────

function mockLogin(credentialType: string, password: string): LoginResponse {
  const users = getMockUsers();
  const user = users.find(
    (u) => u.email === credentialType || u.userName === credentialType
  );
  if (!user) throw new Error('Пользователь не найден');
  // In mock mode passwords aren't hashed — just compare directly
  const storedPwd = localStorage.getItem(`mock_pwd_${user.id}`);
  if (storedPwd !== password) throw new Error('Неверный пароль');

  const token = makeToken();
  const map = getTokenMap();
  map[token] = user.id;
  saveTokenMap(map);

  return { status: true, statusMsg: 'Успешный вход', token, role: user.role, userId: user.id, userName: user.userName };
}

function mockRegister(data: RegisterData): LoginResponse {
  const users = getMockUsers();

  if (users.find((u) => u.email === data.email))
    throw new Error('Пользователь с таким email уже существует');
  if (users.find((u) => u.userName === data.userName))
    throw new Error('Имя пользователя уже занято');
  if (data.userName.length < 3)
    throw new Error('Имя пользователя должно быть не менее 3 символов');
  if (data.password.length < 6)
    throw new Error('Пароль должен содержать минимум 6 символов');

  const newUser: UserProfile = {
    id: Date.now(),
    userName: data.userName,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: 'user',
    phone: data.phone,
    registeredOn: new Date().toISOString(),
  };

  users.push(newUser);
  saveMockUsers(users);
  localStorage.setItem(`mock_pwd_${newUser.id}`, data.password);

  const token = makeToken();
  const map = getTokenMap();
  map[token] = newUser.id;
  saveTokenMap(map);

  return { status: true, statusMsg: 'Успешный вход', token, role: newUser.role, userId: newUser.id, userName: newUser.userName };
}

function mockGetMe(token: string): UserProfile {
  const map = getTokenMap();
  const userId = map[token];
  if (!userId) throw new Error('Сессия истекла');
  const users = getMockUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('Сессия истекла');
  return user;
}

function mockLogout(token: string) {
  const map = getTokenMap();
  delete map[token];
  saveTokenMap(map);
}

function mockGetAllUsers(token: string): UserProfile[] {
  const me = mockGetMe(token);
  if (me.role !== 'admin') throw new Error('Нет доступа');
  return getMockUsers();
}

function mockDeleteUser(token: string, id: number) {
  const me = mockGetMe(token);
  if (me.role !== 'admin') throw new Error('Нет доступа');
  const users = getMockUsers().filter((u) => u.id !== id);
  saveMockUsers(users);
}

// ─── Public API (switches between mock and real) ──────────────────────────────

export async function apiLogin(credentialType: string, password: string): Promise<LoginResponse> {
  if (MOCK_MODE) return mockLogin(credentialType, password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentialType, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.statusMsg || data.message || 'Ошибка входа');
  return data;
}

export async function apiRegister(data: RegisterData): Promise<LoginResponse> {
  if (MOCK_MODE) return mockRegister(data);

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.status) throw new Error(json.statusMsg || json.message || 'Ошибка регистрации');
  return json;
}

export async function apiLogout(token: string): Promise<void> {
  if (MOCK_MODE) { mockLogout(token); return; }

  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'X-KEY': token },
  });
}

export async function apiGetMe(token: string): Promise<UserProfile> {
  if (MOCK_MODE) return mockGetMe(token);

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'X-KEY': token },
  });
  if (!res.ok) throw new Error('Сессия истекла');
  return res.json();
}

export async function apiGetAllUsers(token: string): Promise<UserProfile[]> {
  if (MOCK_MODE) return mockGetAllUsers(token);

  const res = await fetch(`${API_BASE}/user/all`, {
    headers: { 'X-KEY': token },
  });
  if (!res.ok) throw new Error('Нет доступа');
  return res.json();
}

export async function apiDeleteUser(token: string, id: number): Promise<void> {
  if (MOCK_MODE) { mockDeleteUser(token, id); return; }

  const res = await fetch(`${API_BASE}/user/${id}`, {
    method: 'DELETE',
    headers: { 'X-KEY': token },
  });
  if (!res.ok) throw new Error('Ошибка удаления пользователя');
}
