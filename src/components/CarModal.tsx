import { useEffect, useState } from "react";
import "../styles/CarModal.css";
import { toggleFavorite, isFavorite } from "./favorites";

interface Car {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuel?: string;
  transmission?: string;
  condition?: "new" | "used";
}

interface CarModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

const CarModal = ({ car, isOpen, onClose }: CarModalProps) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [liked, setLiked] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (car) {
      setLiked(isFavorite(car.id));
    }
  }, [car?.id]);

  useEffect(() => {
    if (car?.image) {
      setImageSrc(car.image);
    } else {
      setImageSrc("/images/no-image.jpg");
    }
  }, [car]);

  if (!isOpen || !car) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Спасибо за интерес к ${car.title}! Мы свяжемся с вами в ближайшее время.`);
    setShowContactForm(false);
    setContactForm({
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLike = () => {
    if (car) {
      const state = toggleFavorite(car.id);
      setLiked(state);
    }
  };

  const displayName =
    car.brand && car.model ? `${car.brand} ${car.model}` : car.title;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{displayName}</h2>
          {car.condition && (
            <span className={`condition-badge ${car.condition}`}>
              {car.condition === "new" ? "Новый" : "С пробегом"}
            </span>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-image-section">
            <img
              src={imageSrc}
              alt={displayName}
              className="modal-car-image"
              onError={() => setImageSrc("/images/no-image.jpg")}
            />
          </div>

          <div className="modal-details">
            <div className="modal-price-section">
              <div className="modal-price">${car.price.toLocaleString()}</div>
              {car.year && <div className="modal-year">{car.year} год</div>}
            </div>

            <div className="modal-specs">
              {car.mileage !== undefined && (
                <div className="spec-row">
                  <span className="spec-label">Пробег:</span>
                  <span className="spec-value">
                    {car.mileage.toLocaleString()} км
                  </span>
                </div>
              )}

              {car.fuel && (
                <div className="spec-row">
                  <span className="spec-label">Топливо:</span>
                  <span className="spec-value">{car.fuel}</span>
                </div>
              )}

              {car.transmission && (
                <div className="spec-row">
                  <span className="spec-label">Коробка:</span>
                  <span className="spec-value">{car.transmission}</span>
                </div>
              )}

              {car.category && (
                <div className="spec-row">
                  <span className="spec-label">Категория:</span>
                  <span className="spec-value">{car.category}</span>
                </div>
              )}
            </div>

            <div className="modal-description">
              <h3>Описание</h3>
              <p>
                {car.description ||
                  (car.condition === "new"
                    ? `Новый ${displayName} ${car.year || ""} года выпуска. Автомобиль в отличном состоянии с минимальным пробегом.`
                    : `Проверенный ${displayName} ${car.year || ""}. Автомобиль в хорошем техническом состоянии.`)}
              </p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {!showContactForm ? (
            <>
              <button
                className="btn-primary"
                onClick={() => setShowContactForm(true)}
              >
                Связаться с продавцом
              </button>
              <button
                className={`btn-favorite ${liked ? "liked" : ""}`}
                onClick={handleLike}
                title={liked ? "Удалить из избранного" : "Добавить в избранное"}
              >
                {liked ? "♥" : "♡"}
          
              </button>
            </>
          ) : (
            <div className="contact-form">
              <h3>Связаться с продавцом</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Ваше имя"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Телефон"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Сообщение (необязательно)"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">
                    Отправить
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowContactForm(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarModal;