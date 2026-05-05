import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Favorites from './pages/Favorites';
import About from './pages/About';
import SellCar from './pages/SellCar';
import { mockCars } from './const/mockCars';
import type { Car } from './const/mockCars';
import './App.css';

const CARS_STORAGE_KEY = 'buycars-cars';

const loadStoredCars = () => {
  if (typeof window === 'undefined') {
    return mockCars;
  }

  try {
    const storedCars = window.localStorage.getItem(CARS_STORAGE_KEY);

    if (!storedCars) {
      return mockCars;
    }

    const parsedCars = JSON.parse(storedCars) as Car[];

    return Array.isArray(parsedCars) ? parsedCars : mockCars;
  } catch {
    return mockCars;
  }
};

function App() {
  const [cars, setCars] = useState<Car[]>(loadStoredCars);

  useEffect(() => {
    window.localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);

  const handleAddCar = (carData: Omit<Car, 'id'>) => {
    setCars((prevCars) => {
      const nextId = prevCars.length > 0 ? Math.max(...prevCars.map((car) => car.id)) + 1 : 1;
      return [{ ...carData, id: nextId, isUserCreated: true }, ...prevCars];
    });
  };

  const handleDeleteCar = (carId: number) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));

    try {
      const favoritesRaw = window.localStorage.getItem('favorites');

      if (favoritesRaw) {
        const favoriteIds = JSON.parse(favoritesRaw) as number[];
        const nextFavoriteIds = favoriteIds.filter((favoriteId) => favoriteId !== carId);
        window.localStorage.setItem('favorites', JSON.stringify(nextFavoriteIds));
      }
    } catch {
      // Ignore favorite cleanup errors so deletion still succeeds.
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog cars={cars} onDeleteCar={handleDeleteCar} />} />
            <Route path="/favorites" element={<Favorites cars={cars} onDeleteCar={handleDeleteCar} />} />
            <Route path="/about" element={<About />} />
            <Route path="/sell" element={<SellCar onAddCar={handleAddCar} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;