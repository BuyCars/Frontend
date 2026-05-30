const getKey = (userId?: number) =>
  userId ? `favorites_${userId}` : 'favorites_guest';

export const getFavorites = (userId?: number): number[] => {
  try {
    const data = localStorage.getItem(getKey(userId));
    return data ? (JSON.parse(data) as number[]) : [];
  } catch {
    return [];
  }
};

export const toggleFavorite = (id: number, userId?: number): boolean => {
  const favorites = getFavorites(userId);
  if (favorites.includes(id)) {
    localStorage.setItem(getKey(userId), JSON.stringify(favorites.filter((f) => f !== id)));
    return false;
  } else {
    localStorage.setItem(getKey(userId), JSON.stringify([...favorites, id]));
    return true;
  }
};

export const isFavorite = (id: number, userId?: number): boolean =>
  getFavorites(userId).includes(id);
