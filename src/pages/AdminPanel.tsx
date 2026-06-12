import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetAllUsers, apiDeleteUser, type UserProfile } from '../api/auth';
import type { Car } from '../const/mockCars';
import '../styles/AdminPanel.css';

interface AdminPanelProps {
  cars?: Car[];
  onDeleteCar?: (carId: number) => void;
  onEditCar?: (carId: number, updates: Partial<Omit<Car, 'id'>>) => void;
}

type Tab = 'users' | 'cars';

interface EditForm {
  title: string;
  price: string;
  description: string;
  category: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  condition: 'new' | 'used';
}

export default function AdminPanel({ cars = [], onDeleteCar, onEditCar }: AdminPanelProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    apiGetAllUsers(user.token)
      .then(setUsers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleDeleteUser = async (id: number, userName: string) => {
    if (!user || !window.confirm(`Удалить пользователя «${userName}»?`)) return;
    try {
      await apiDeleteUser(user.token, id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch { alert('Ошибка при удалении пользователя'); }
  };

  const handleDeleteCar = (id: number, title: string) => {
    if (!window.confirm(`Удалить объявление «${title}»?`)) return;
    onDeleteCar?.(id);
  };

  const startEditCar = (car: Car) => {
    setEditingCarId(car.id);
    setEditForm({
      title: car.title,
      price: String(car.price),
      description: car.description,
      category: car.category,
      year: String(car.year ?? ''),
      mileage: String(car.mileage ?? ''),
      fuel: car.fuel ?? 'Бензин',
      transmission: car.transmission ?? 'Автомат',
      condition: car.condition ?? 'used',
    });
  };

  const saveEditCar = (carId: number) => {
    if (!editForm) return;
    onEditCar?.(carId, {
      title: editForm.title,
      price: Number(editForm.price),
      description: editForm.description,
      category: editForm.category,
      year: Number(editForm.year),
      mileage: Number(editForm.mileage),
      fuel: editForm.fuel,
      transmission: editForm.transmission,
      condition: editForm.condition,
    });
    setEditingCarId(null);
    setEditForm(null);
  };

  const userCars = cars.filter((c) => c.isUserCreated);

  if (loading) return <div className="admin-panel"><div className="admin-container"><p className="admin-status">Загрузка...</p></div></div>;
  if (error) return <div className="admin-panel"><div className="admin-container"><p className="admin-status admin-status--error">{error}</p></div></div>;

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Панель администратора</h1>
          <div className="admin-tabs">
            <button className={`admin-tab ${tab === 'users' ? 'admin-tab--active' : ''}`} onClick={() => setTab('users')}>
              Пользователи
              <span className="admin-tab-count">{users.length}</span>
            </button>
            <button className={`admin-tab ${tab === 'cars' ? 'admin-tab--active' : ''}`} onClick={() => setTab('cars')}>
              Объявления
              <span className="admin-tab-count">{userCars.length}</span>
            </button>
          </div>
        </div>

        {tab === 'users' && (
          <div className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Пользователь</th><th>Email</th><th>Имя</th><th>Телефон</th><th>Роль</th><th>Регистрация</th><th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className={u.role === 'admin' ? 'admin-row--highlight' : ''}>
                      <td className="td-muted">{u.id}</td>
                      <td className="td-bold">{u.userName}</td>
                      <td>{u.email}</td>
                      <td>{[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}</td>
                      <td>{u.phone || '—'}</td>
                      <td><span className={`role-chip ${u.role === 'admin' ? 'role-chip--admin' : ''}`}>{u.role === 'admin' ? 'Админ' : 'Пользователь'}</span></td>
                      <td className="td-muted">{u.registeredOn ? new Date(u.registeredOn).toLocaleDateString('ru-RU') : '—'}</td>
                      <td>
                        {u.id === user?.id
                          ? <span className="td-self">Вы</span>
                          : <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteUser(u.id, u.userName)}>Удалить</button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'cars' && (
          <div className="admin-section">
            {userCars.length === 0 ? (
              <p className="admin-empty">Нет объявлений от пользователей</p>
            ) : (
              <div className="admin-cars-list">
                {userCars.map((car) => (
                  <div key={car.id} className="admin-car-item">
                    {editingCarId === car.id && editForm ? (
                      <div className="admin-car-edit">
                        <div className="admin-edit-grid">
                          <label className="admin-edit-label">
                            Название
                            <input className="admin-edit-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                          </label>
                          <label className="admin-edit-label">
                            Цена ($)
                            <input className="admin-edit-input" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                          </label>
                          <label className="admin-edit-label">
                            Год
                            <input className="admin-edit-input" type="number" value={editForm.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} />
                          </label>
                          <label className="admin-edit-label">
                            Пробег (км)
                            <input className="admin-edit-input" type="number" value={editForm.mileage} onChange={(e) => setEditForm({ ...editForm, mileage: e.target.value })} />
                          </label>
                          <label className="admin-edit-label">
                            Топливо
                            <select className="admin-edit-input" value={editForm.fuel} onChange={(e) => setEditForm({ ...editForm, fuel: e.target.value })}>
                              <option>Бензин</option><option>Дизель</option><option>Гибрид</option><option>Электро</option>
                            </select>
                          </label>
                          <label className="admin-edit-label">
                            Коробка
                            <select className="admin-edit-input" value={editForm.transmission} onChange={(e) => setEditForm({ ...editForm, transmission: e.target.value })}>
                              <option>Автомат</option><option>Механика</option>
                            </select>
                          </label>
                          <label className="admin-edit-label">
                            Состояние
                            <select className="admin-edit-input" value={editForm.condition} onChange={(e) => setEditForm({ ...editForm, condition: e.target.value as 'new' | 'used' })}>
                              <option value="used">С пробегом</option><option value="new">Новый</option>
                            </select>
                          </label>
                          <label className="admin-edit-label">
                            Категория
                            <select className="admin-edit-input" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                              <option value="sedan">Седан</option><option value="suv">Внедорожник</option>
                              <option value="hatchback">Хэтчбек</option><option value="sports">Спорт</option><option value="electric">Электро</option>
                            </select>
                          </label>
                        </div>
                        <label className="admin-edit-label" style={{ marginTop: 12 }}>
                          Описание
                          <textarea className="admin-edit-input admin-edit-textarea" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
                        </label>
                        <div className="admin-car-actions" style={{ marginTop: 16 }}>
                          <button className="admin-btn admin-btn--primary" onClick={() => saveEditCar(car.id)}>Сохранить</button>
                          <button className="admin-btn" onClick={() => setEditingCarId(null)}>Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="admin-car-row">
                        <img className="admin-car-thumb" src={car.image} alt={car.title} onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/no-image.jpg'; }} />
                        <div className="admin-car-info">
                          <div className="admin-car-name">{car.brand && car.model ? `${car.brand} ${car.model}` : car.title}</div>
                          <div className="admin-car-meta">
                            <span>${car.price.toLocaleString()}</span>
                            {car.year && <span>{car.year}</span>}
                            {car.mileage !== undefined && <span>{car.mileage.toLocaleString()} км</span>}
                            <span className="td-muted">ID пользователя: {car.userId ?? '—'}</span>
                          </div>
                        </div>
                        <div className="admin-car-actions">
                          <button className="admin-btn" onClick={() => startEditCar(car)}>Редактировать</button>
                          <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteCar(car.id, car.title)}>Удалить</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
