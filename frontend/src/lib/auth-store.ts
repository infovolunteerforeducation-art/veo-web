// auth-store.ts — localStorage-based auth utilities for VEO Web
// Demo account: an.nguyen@gmail.com / Demo@123

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  joinedAt: string;
};

const USERS_KEY = "veo_users";
const SESSION_KEY = "veo_session_email";

const DEMO_USER: StoredUser = {
  id: "cust-1",
  name: "Nguyễn Văn An",
  email: "an.nguyen@gmail.com",
  phone: "0912345678",
  password: "Demo@123",
  joinedAt: "2024-06-10",
};

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [DEMO_USER];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = raw ? JSON.parse(raw) : [];
    // Always ensure the demo user exists
    const hasDemoUser = users.some((u) => u.id === DEMO_USER.id);
    if (!hasDemoUser) {
      users.unshift(DEMO_USER);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch {
    return [DEMO_USER];
  }
}

export function saveUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionEmail(email: string | null): void {
  if (typeof window === "undefined") return;
  if (email === null) {
    localStorage.removeItem(SESSION_KEY);
  } else {
    localStorage.setItem(SESSION_KEY, email);
  }
}

export function authLogin(email: string, password: string): StoredUser | null {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) {
    setSessionEmail(user.email);
    return user;
  }
  return null;
}

export function authRegister(
  name: string,
  email: string,
  phone: string,
  password: string
): { ok: boolean; error?: string } {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, error: "Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập." };
  }
  const newUser: StoredUser = {
    id: `cust-${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password,
    joinedAt: new Date().toISOString().slice(0, 10),
  };
  users.push(newUser);
  saveUsers(users);
  return { ok: true };
}

export function authChangePassword(
  email: string,
  currentPw: string,
  newPw: string
): { ok: boolean; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) {
    return { ok: false, error: "Không tìm thấy tài khoản." };
  }
  if (users[idx].password !== currentPw) {
    return { ok: false, error: "Mật khẩu hiện tại không đúng." };
  }
  users[idx] = { ...users[idx], password: newPw };
  saveUsers(users);
  return { ok: true };
}

export function authVerifyIdentity(email: string, phone: string): boolean {
  const users = getUsers();
  return users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.phone === phone
  );
}

export function authSetNewPassword(
  email: string,
  newPassword: string
): { ok: boolean; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { ok: false, error: "Không tìm thấy tài khoản." };
  users[idx] = { ...users[idx], password: newPassword };
  saveUsers(users);
  return { ok: true };
}
