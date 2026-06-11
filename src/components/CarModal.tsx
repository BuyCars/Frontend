import { useEffect, useState } from "react";
import "../styles/CarModal.css";
import { toggleFavorite, isFavorite } from "./favorites";
import { useAuth } from "../context/AuthContext";
import type { Car } from "../const/mockCars";

interface CarModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteCar?: (carId: number) => void;
  onEditCar?: (carId: number, updates: Partial<Omit<Car, 'id'>>) => void;
}

const CarModal = ({ car, isOpen, onClose, onDeleteCar, onEditCar }: CarModalProps) => {
  const { user } = useAuth();
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [liked, setLiked] = useState(false);


  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (car) {
      setLiked(isFavorite(car.id, user?.id));
    }
  }, [car?.id, user?.id]);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsFullscreenOpen(false);
    setShowContactForm(false);
  }, [car?.id]);

  useEffect(() => {
    if (!isFullscreenOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreenOpen(false);
      }

      if (event.key === "ArrowLeft") {
        setActiveImageIndex((currentIndex) => Math.max(0, currentIndex - 1));
      }

      if (event.key === "ArrowRight") {
        setActiveImageIndex((currentIndex) => Math.min(galleryImages.length - 1, currentIndex + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenOpen]);

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
    if (car && user) {
      const state = toggleFavorite(car.id, user.id);
      setLiked(state);
    }
  };

  const canDelete = car && onDeleteCar && (
    (car.isUserCreated && car.userId === user?.id) || user?.role === 'admin'
  );

  const handleDelete = () => {
    const confirmed = window.confirm(`Удалить объявление «${displayName}»?`);

    if (confirmed) {
      onDeleteCar?.(car.id);
    }
  };

  const displayName =
    car.brand && car.model ? `${car.brand} ${car.model}` : car.title;

  const galleryImages =
    car.images && car.images.length > 0
      ? car.images
      : car.image
      ? [car.image]
      : ["/images/no-image.jpg"];

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0] || "/images/no-image.jpg";

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) => Math.min(galleryImages.length - 1, currentIndex + 1));
  };

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
            <button
              type="button"
              className="modal-image-button"
              onClick={() => setIsFullscreenOpen(true)}
            >
              <img
                src={currentImage}
                alt={displayName}
                className="modal-car-image"
                onError={(event) => {
                  event.currentTarget.src = "/images/no-image.jpg";
                }}
              />
              <span className="modal-fullscreen-hint">Открыть на весь экран</span>
            </button>

            {galleryImages.length > 1 && (
              <div className="modal-thumbnails">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${car.id}-${index}`}
                    className={`thumbnail-button ${index === activeImageIndex ? "active" : ""}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Фото ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${displayName} ${index + 1}`}
                      className="modal-thumbnail-image"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/no-image.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
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
              <div className="modal-actions-left">
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
              </div>
              {canDelete && (
                <button className="btn-delete" onClick={handleDelete}>
                  Удалить
                </button>
              )}
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

      {isFullscreenOpen && (
        <div className="fullscreen-overlay" onClick={() => setIsFullscreenOpen(false)}>
          <div className="fullscreen-content" onClick={(event) => event.stopPropagation()}>
            <button className="fullscreen-close" type="button" onClick={() => setIsFullscreenOpen(false)}>
              ×
            </button>

            <img
              src={currentImage}
              alt={displayName}
              className="fullscreen-image"
              onError={(event) => {
                event.currentTarget.src = "/images/no-image.jpg";
              }}
            />

            {galleryImages.length > 1 && (
              <div className="fullscreen-controls">
                <button type="button" className="fullscreen-control" onClick={showPreviousImage} disabled={activeImageIndex === 0}>
                  ←
                </button>
                <span>
                  {activeImageIndex + 1} / {galleryImages.length}
                </span>
                <button
                  type="button"
                  className="fullscreen-control"
                  onClick={showNextImage}
                  disabled={activeImageIndex === galleryImages.length - 1}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarModal;