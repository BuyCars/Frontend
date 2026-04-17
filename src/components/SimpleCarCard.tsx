import { useState } from "react";
import "../styles/SimpleCarCard.css";
import CarModal from "./CarModal";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  condition: "new" | "used";
  fuel?: string;
  transmission?: string;
}

interface SimpleCarCardProps {
  car: Car;
}

const SimpleCarCard = ({ car }: SimpleCarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);


  return (
    <>
      <div className="simple-car-card">

        <div
          className="car-image-wrapper"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
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
            {liked ? "❤️" : "🤍"}
          </button>

        </div>

        <div className="car-details">

          <h3 className="car-title">
            {car.brand} {car.model}
          </h3>

          <p className="car-year">{car.year}</p>

          <div className="car-specs-row">
            <span>🛣 {car.mileage.toLocaleString()} км</span>
            {car.fuel && <span>⛽ {car.fuel}</span>}
            {car.transmission && <span>⚙ {car.transmission}</span>}
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