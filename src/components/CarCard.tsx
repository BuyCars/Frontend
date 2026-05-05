import { useState, useEffect } from "react";
import "../styles/CarCard.css";
import CarModal from "./CarModal";
import { toggleFavorite, isFavorite } from "./favorites";
import type { Car } from "../const/mockCars";

interface CarCardProps {
  car: Car;
  onDeleteCar?: (carId: number) => void;
}

const CarCard = ({ car, onDeleteCar }: CarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(isFavorite(car.id));
  }, [car.id]);

  const handleLike = () => {
    const state = toggleFavorite(car.id);
    setLiked(state);
  };

  const displayName =
    car.brand && car.model ? `${car.brand} ${car.model}` : car.title;

  return (
    <>
      <div className="car-card">
        <div className="car-image" onClick={() => setIsModalOpen(true)}>
          <img
            src={car.image}
            alt={displayName}
            className="car-img"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/no-image.jpg";
            }}
          />
          {car.condition === "new" && (
            <span className="badge-new">Новый</span>
          )}
        </div>

        <div className="car-info">
          <h3>{displayName}</h3>

          {car.year && <p className="car-year">Год: {car.year}</p>}

          {(car.fuel || car.transmission || car.mileage !== undefined) && (
            <div className="car-specs">
              {car.fuel && <span>{car.fuel}</span>}
              {car.transmission && <span>{car.transmission}</span>}
              {car.mileage !== undefined && (
                <span>{car.mileage.toLocaleString()} км</span>
              )}
            </div>
          )}

          <p className="car-description">{car.description}</p>

          <div className="car-footer">
            <div className="car-price">${car.price.toLocaleString()}</div>

            <div className="car-actions">
              <button
                className={`btn-favorite ${liked ? "liked" : ""}`}
                onClick={handleLike}
                title={liked ? "Удалить из избранного" : "Добавить в избранное"}
              >
                {liked ? "♥" : "♡"}
              </button>

              <button
                className="btn-details"
                onClick={() => setIsModalOpen(true)}
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>

      <CarModal
        car={car}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeleteCar={onDeleteCar}
      />
    </>
  );
};

export default CarCard;