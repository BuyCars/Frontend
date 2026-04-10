export const getFavorites = (): number[] => {
  const data = localStorage.getItem("favorites");
  return data ? JSON.parse(data) : [];
};

export const toggleFavorite = (id: number) => {
  const favorites = getFavorites();

  if (favorites.includes(id)) {
    const updated = favorites.filter(f => f !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    return false;
  } else {
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    return true;
  }
};

export const isFavorite = (id: number) => {
  return getFavorites().includes(id);
};