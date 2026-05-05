import { useMemo } from "react";
import "../styles/CarCatalog.css";
import CarCard from "./CarCard";
import type { Car } from "../const/mockCars";

interface CarCatalogProps {
  cars: Car[];
  onDeleteCar?: (carId: number) => void;
  searchTerm?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  category?: string;
}

const CarCatalog = ({
  cars,
  onDeleteCar,
  searchTerm = "",
  minPrice = "",
  maxPrice = "",
  category = "",
}: CarCatalogProps) => {
  const filteredCars = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return cars.filter((car) => {
      const matchesSearch =
        !term ||
        car.title.toLowerCase().includes(term) ||
        car.brand?.toLowerCase().includes(term) ||
        car.model?.toLowerCase().includes(term) ||
        car.description.toLowerCase().includes(term);

      const matchesCategory = !category || car.category === category;

      const matchesMinPrice =
        minPrice === "" || car.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || car.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [cars, searchTerm, minPrice, maxPrice, category]);

  return (
    <section id="catalog" className="car-catalog">
      <div className="catalog-header">
        <h2>Каталог автомобилей</h2>
        <p className="catalog-count">{filteredCars.length} объявлений</p>
      </div>

      {filteredCars.length === 0 ? (
        <div className="state-container empty">
          <p>Ничего не найдено по вашему запросу</p>
        </div>
      ) : (
        <div className="cars-grid">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onDeleteCar={onDeleteCar} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CarCatalog;