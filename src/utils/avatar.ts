const PREFIX = 'buycars-avatar-';

export function getAvatar(userId: number): string | null {
  return localStorage.getItem(`${PREFIX}${userId}`);
}

export function setAvatar(userId: number, dataUrl: string): void {
  localStorage.setItem(`${PREFIX}${userId}`, dataUrl);
}

export function clearAvatar(userId: number): void {
  localStorage.removeItem(`${PREFIX}${userId}`);
}
