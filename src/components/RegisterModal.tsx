import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

interface Props {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box--wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Регистрация</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label className="form-label">
              Имя
              <input className="form-input" value={form.firstName} onChange={setField('firstName')} />
            </label>
            <label className="form-label">
              Фамилия
              <input className="form-input" value={form.lastName} onChange={setField('lastName')} />
            </label>
          </div>
          <label className="form-label">
            Имя пользователя *
            <input
              className="form-input"
              value={form.userName}
              onChange={setField('userName')}
              required
              minLength={3}
              maxLength={30}
            />
          </label>
          <label className="form-label">
            Email *
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={setField('email')}
              required
            />
          </label>
          <label className="form-label">
            Пароль * (минимум 6 символов)
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={setField('password')}
              required
              minLength={6}
            />
          </label>
          <label className="form-label">
            Телефон
            <input
              className="form-input"
              type="tel"
              value={form.phone}
              onChange={setField('phone')}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="modal-switch">
          Уже есть аккаунт?{' '}
          <button type="button" className="link-btn" onClick={onSwitchToLogin}>
            Войти
          </button>
        </p>
      </div>
    </div>
  );
}
