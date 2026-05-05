import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Car } from '../const/mockCars';
import '../styles/SellCar.css';

interface SellCarProps {
  onAddCar: (carData: Omit<Car, 'id'>) => void;
}

interface SellCarForm {
  brand: string;
  model: string;
  title: string;
  category: string;
  price: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  condition: 'new' | 'used';
  description: string;
}

const initialForm: SellCarForm = {
  brand: '',
  model: '',
  title: '',
  category: 'sedan',
  price: '',
  year: '',
  mileage: '',
  fuel: 'Бензин',
  transmission: 'Автомат',
  condition: 'used',
  description: '',
};

const categories = [
  { value: 'sedan', label: 'Седан' },
  { value: 'suv', label: 'Внедорожник' },
  { value: 'hatchback', label: 'Хэтчбек' },
  { value: 'sports', label: 'Спорт' },
  { value: 'electric', label: 'Электро' },
];

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Не удалось прочитать файл изображения'));
    reader.readAsDataURL(file);
  });

const SellCar = ({ onAddCar }: SellCarProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SellCarForm>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const computedTitle = useMemo(() => {
    const defaultTitle = `${form.brand} ${form.model}`.trim();
    return form.title.trim() || defaultTitle;
  }, [form.brand, form.model, form.title]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith('image/')
    );

    if (selectedFiles.length === 0) {
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles].slice(0, 8));
    event.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (files.length === 0) {
      setErrorMessage('Добавьте хотя бы одно фото автомобиля.');
      return;
    }

    const parsedPrice = Number(form.price);
    const parsedYear = Number(form.year);
    const parsedMileage = Number(form.mileage);

    if (!computedTitle || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Проверьте название и цену автомобиля.');
      return;
    }

    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
      setErrorMessage('Укажите корректный год выпуска.');
      return;
    }

    if (Number.isNaN(parsedMileage) || parsedMileage < 0) {
      setErrorMessage('Укажите корректный пробег.');
      return;
    }

    setIsSubmitting(true);

    try {
      const images = await Promise.all(files.map((file) => toDataUrl(file)));

      onAddCar({
        title: computedTitle,
        brand: form.brand.trim(),
        model: form.model.trim(),
        price: parsedPrice,
        description: form.description.trim(),
        image: images[0],
        images,
        category: form.category,
        year: parsedYear,
        mileage: parsedMileage,
        fuel: form.fuel,
        transmission: form.transmission,
        condition: form.condition,
        isUserCreated: true,
      });

      navigate('/catalog');
    } catch {
      setErrorMessage('Не удалось загрузить изображения. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-page">
      <section className="sell-hero">
        <h1>Разместить объявление</h1>
        <p>Заполните данные, добавьте фото и мы сразу опубликуем авто в каталоге.</p>
      </section>

      <section className="sell-form-section">
        <form className="sell-form" onSubmit={handleSubmit}>
          <div className="sell-grid">
            <label>
              Марка
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="BMW"
                required
              />
            </label>

            <label>
              Модель
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="X5"
                required
              />
            </label>

            <label>
              Название объявления (опционально)
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Если пусто, будет Марка + Модель"
              />
            </label>

            <label>
              Категория
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Цена ($)
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="1"
                placeholder="25000"
                required
              />
            </label>

            <label>
              Год выпуска
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                min="1900"
                max={String(new Date().getFullYear() + 1)}
                placeholder="2022"
                required
              />
            </label>

            <label>
              Пробег (км)
              <input
                type="number"
                name="mileage"
                value={form.mileage}
                onChange={handleChange}
                min="0"
                placeholder="35000"
                required
              />
            </label>

            <label>
              Тип топлива
              <select name="fuel" value={form.fuel} onChange={handleChange}>
                <option value="Бензин">Бензин</option>
                <option value="Дизель">Дизель</option>
                <option value="Гибрид">Гибрид</option>
                <option value="Электро">Электро</option>
              </select>
            </label>

            <label>
              Коробка
              <select name="transmission" value={form.transmission} onChange={handleChange}>
                <option value="Автомат">Автомат</option>
                <option value="Механика">Механика</option>
              </select>
            </label>

            <label>
              Состояние
              <select name="condition" value={form.condition} onChange={handleChange}>
                <option value="used">С пробегом</option>
                <option value="new">Новый</option>
              </select>
            </label>
          </div>

          <label className="description-field">
            Описание
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Опишите состояние, комплектацию и особенности"
              required
            />
          </label>

          <div className="upload-field">
            <span>Фото авто (можно несколько, до 8)</span>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
            {previewUrls.length > 0 && (
              <div className="preview-grid">
                {previewUrls.map((previewUrl, index) => (
                  <div className="preview-item" key={`${previewUrl}-${index}`}>
                    <img src={previewUrl} alt={`Фото ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)}>
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sell-summary">Публикуем как: {computedTitle || 'Укажите марку и модель'}</div>

          {errorMessage && <p className="sell-error">{errorMessage}</p>}

          <div className="sell-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Публикуем...' : 'Опубликовать объявление'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SellCar;
