import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Favorites.css';
import { getFavorites } from '../components/favorites';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/CarCard';
import type { Car } from '../const/mockCars';

interface FavoritesProps {
  cars: Car[];
  onDeleteCar?: (carId: number) => void;
}

const Favorites = ({ cars, onDeleteCar }: FavoritesProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoritesCars, setFavoritesCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const favoriteIds = getFavorites(user.id);
    setFavoritesCars(cars.filter((car) => favoriteIds.includes(car.id)));
    setLoading(false);
  }, [cars, user, navigate]);

  if (!user) return null;

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1>Мои избранные автомобили</h1>

        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : favoritesCars.length === 0 ? (
          <div className="empty-state">
            <p>У вас нет избранных автомобилей</p>
            <Link to="/catalog" className="btn-browse">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoritesCars.map((car) => (
              <CarCard key={car.id} car={car} onDeleteCar={onDeleteCar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
