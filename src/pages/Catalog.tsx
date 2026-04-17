import { useState } from 'react';
import '../styles/Catalog.css';
import CarCatalog from '../components/CarCatalog';
import BrandsSection from '../components/BrandsSection';
import FilterSection from '../components/FilterSection';

const Catalog = () => {
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
        searchTerm={searchTerm} 
        minPrice={priceMin} 
        maxPrice={priceMax}
        category={category}
      />
    </div>
  );
};

export default Catalog;
