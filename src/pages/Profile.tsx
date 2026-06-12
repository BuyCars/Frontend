import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/CarCard';
import type { Car } from '../const/mockCars';
import { getAvatar, setAvatar, clearAvatar } from '../utils/avatar';
import '../styles/Profile.css';

interface ProfileProps {
  cars: Car[];
  onDeleteCar: (carId: number) => void;
  onEditCar?: (carId: number, updates: Partial<Omit<Car, 'id'>>) => void;
}

export default function Profile({ cars, onDeleteCar, onEditCar }: ProfileProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    setAvatarUrl(getAvatar(user.id));
  }, [user, navigate]);

  if (!user || !profile) return null;

  const userCars = cars.filter((c) => c.userId === user.id && c.isUserCreated);

  const initials = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .map((s) => s[0].toUpperCase())
    .join('') || user.userName[0].toUpperCase();

  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') || user.userName;

  const registeredDate = profile.registeredOn
    ? new Date(profile.registeredOn).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Выберите файл изображения.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Файл слишком большой. Максимум 5 МБ.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject();
        reader.readAsDataURL(file);
      });

      setAvatar(user.id, dataUrl);
      setAvatarUrl(dataUrl);
      window.dispatchEvent(new Event('avatar-updated'));
    } catch {
      setUploadError('Не удалось загрузить фото.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    clearAvatar(user.id);
    setAvatarUrl(null);
    window.dispatchEvent(new Event('avatar-updated'));
  };

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-card">

          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <button
              className={`profile-avatar-btn ${isUploading ? 'profile-avatar-btn--loading' : ''}`}
              onClick={handleAvatarClick}
              title="Изменить фото"
              disabled={isUploading}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Аватар" className="profile-avatar-img" />
              ) : (
                <span className="profile-avatar-initials">{initials}</span>
              )}
              <span className="profile-avatar-overlay">
                {isUploading ? '...' : 'Изменить'}
              </span>
            </button>

            {avatarUrl && (
              <button
                className="profile-avatar-remove"
                onClick={handleRemoveAvatar}
                title="Удалить фото"
              >
                ✕
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="profile-file-input"
              onChange={handleFileChange}
            />
          </div>

          {/* Info */}
          <div className="profile-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{fullName}</h1>
              {profile.role === 'admin' && (
                <span className="profile-role-badge">Администратор</span>
              )}
            </div>
            <p className="profile-username">@{profile.userName}</p>

            {uploadError && <p className="profile-upload-error">{uploadError}</p>}

            <div className="profile-details">
              {profile.email && (
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Email</span>
                  <span className="profile-detail-value">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="profile-detail-item">
                  <span className="profile-detail-label">Телефон</span>
                  <span className="profile-detail-value">{profile.phone}</span>
                </div>
              )}
              {registeredDate && (
                <div className="profile-detail-item">
                  <span className="profile-detail-label">На сайте с</span>
                  <span className="profile-detail-value">{registeredDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="profile-listings">
        <div className="profile-listings-header">
          <h2 className="profile-listings-title">
            Мои объявления
            <span className="profile-count">{userCars.length}</span>
          </h2>
          <Link to="/sell" className="profile-add-btn">+ Добавить объявление</Link>
        </div>

        {userCars.length === 0 ? (
          <div className="profile-empty">
            <p>У вас пока нет объявлений</p>
            <Link to="/sell" className="profile-empty-link">Разместить первое объявление</Link>
          </div>
        ) : (
          <div className="profile-cars-grid">
            {userCars.map((car) => (
              <CarCard key={car.id} car={car} onDeleteCar={onDeleteCar} onEditCar={onEditCar} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
