import { useState } from "react";
import "../styles/SimpleCarCard.css";
import CarModal from "./CarModal";
import type { Car } from "../const/mockCars";

interface SimpleCarCardProps {
  car: Car;
}

const SimpleCarCard = ({ car }: SimpleCarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const displayName = car.brand && car.model ? `${car.brand} ${car.model}` : car.title;


  return (
    <>
      <div className="simple-car-card">

        <div
          className="car-image-wrapper"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={car.image}
            alt={displayName}
            className="car-image-img"
          />

          <span className={`condition-badge ${car.condition}`}>
            {car.condition === "new" ? "Новый" : "Б/У"}
          </span>

          <button
            className={`favorite-btn ${liked ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
          >
            {liked ? "В избранном" : "В избранное"}
          </button>

        </div>

        <div className="car-details">

          <h3 className="car-title">
            {displayName}
          </h3>

          {car.year !== undefined && <p className="car-year">{car.year}</p>}

          <div className="car-specs-row">
            {car.mileage !== undefined && <span>Пробег: {car.mileage.toLocaleString()} км</span>}
            {car.fuel && <span>Топливо: {car.fuel}</span>}
            {car.transmission && <span>КПП: {car.transmission}</span>}
          </div>

          <div className="car-price">
            ${car.price.toLocaleString()}
          </div>

          <div className="car-buttons">

            <button
              className="btn-details"
              onClick={() => setIsModalOpen(true)}
            >
              Подробнее
            </button>

          
          

          </div>

        </div>
      </div>

      <CarModal
        car={car} 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default SimpleCarCard;