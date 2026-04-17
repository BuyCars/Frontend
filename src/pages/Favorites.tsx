import { useState, useEffect } from 'react';
import '../styles/Favorites.css';
import { getFavorites } from '../components/favorites';
import CarCard from '../components/CarCard';
import { mockCars, Car } from '../const/mockCars';

const Favorites = () => {
  const [favoritesCars, setFavoritesCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const favoriteIds = getFavorites();
      
      if (favoriteIds.length === 0) {
        setFavoritesCars([]);
        setLoading(false);
        return;
      }

      try {
        const filtered = mockCars.filter(car => favoriteIds.includes(car.id));
        setFavoritesCars(filtered);
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1>Мои избранные автомобили</h1>
        
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : favoritesCars.length === 0 ? (
          <div className="empty-state">
            <p>У вас нет избранных автомобилей</p>
            <a href="/catalog" className="btn-browse">Перейти в каталог</a>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoritesCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;