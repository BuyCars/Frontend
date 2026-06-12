import { useState } from 'react';
import '../styles/Catalog.css';
import CarCatalog from '../components/CarCatalog';
import BrandsSection from '../components/BrandsSection';
import FilterSection from '../components/FilterSection';
import type { Car } from '../const/mockCars';

interface CatalogProps {
  cars: Car[];
  onDeleteCar?: (carId: number) => void;
  onEditCar?: (carId: number, updates: Partial<Omit<Car, 'id'>>) => void;
}

const Catalog = ({ cars, onDeleteCar, onEditCar }: CatalogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [category, setCategory] = useState('');

  const handleFilter = (filters: { 
    searchTerm: string; 
    priceMin: number; 
    priceMax: number;
    category: string;
  }) => {
    setSearchTerm(filters.searchTerm);
    setPriceMin(filters.priceMin);
    setPriceMax(filters.priceMax);
    setCategory(filters.category);
  };

  return (
    <div className="catalog-page">
      <FilterSection onFilter={handleFilter} />
      <BrandsSection />
      <CarCatalog
        cars={cars}
        onDeleteCar={onDeleteCar}
        onEditCar={onEditCar}
        searchTerm={searchTerm}
        minPrice={priceMin}
        maxPrice={priceMax}
        category={category}
      />
    </div>
  );
};

export default Catalog;
