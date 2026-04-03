import { useState } from 'react';
import '../styles/FilterSection.css';

interface FilterProps {
  onFilter: (filters: {
    searchTerm: string;
    priceMin: number;
    priceMax: number;
    category: string;
  }) => void;
}

const FilterSection = ({ onFilter }: FilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Категории автомобилей (УРОВЕНЬ 2)
  const categories = [
    { id: 'sedan', label: '🚗 Седан' },
    { id: 'suv', label: '🚙 Внедорожник' },
    { id: 'hatchback', label: '🚕 Хэтчбек' },
    { id: 'sports', label: '⚡ Спорт' },
    { id: 'electric', label: '🔋 Электро' }
  ];

  const handleApplyFilter = () => {
    onFilter({
      searchTerm,
      priceMin,
      priceMax,
      category: selectedCategory
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(newCategory);
    onFilter({
      searchTerm,
      priceMin,
      priceMax,
      category: newCategory
    });
  };

  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <>
      <button className="btn-filter-fixed" onClick={toggleOpen} title="Фильтры">
        ☰ Фильтр
      </button>

      {isOpen && <div className="filter-overlay" onClick={() => setIsOpen(false)}></div>}

      <aside className={`filter-panel ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Фильтры</h3>
          <button className="btn-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="filter-content">
          {/* Категории (УРОВЕНЬ 2) */}
          <div className="filter-group">
            <label>Категория</label>
            <div className="category-buttons">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`btn-category ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Поиск по марке/модели</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Введите марку или модель"
              className="text-filter"
            />
          </div>

          <div className="filter-group">
            <label>Цена от: <strong>{priceMin.toLocaleString()}</strong></label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              className="price-slider"
            />
            <input
              type="number"
              min="0"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value === '' ? 0 : Number(e.target.value))}
              className="number-filter"
              placeholder="0"
            />
          </div>

          <div className="filter-group">
            <label>Цена до: <strong>{priceMax.toLocaleString()}</strong></label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="price-slider"
            />
            <input
              type="number"
              min="0"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value === '' ? 1000000 : Number(e.target.value))}
              className="number-filter"
              placeholder="1000000"
            />
          </div>

          <button className="btn-apply-filter" onClick={handleApplyFilter}>
            Применить фильтры
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSection;
