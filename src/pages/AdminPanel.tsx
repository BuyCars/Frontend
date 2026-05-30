import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetAllUsers, apiDeleteUser, type UserProfile } from '../api/auth';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    apiGetAllUsers(user.token)
      .then(setUsers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleDelete = async (id: number, userName: string) => {
    if (!user) return;
    if (!window.confirm(`Удалить пользователя "${userName}"?`)) return;
    try {
      await apiDeleteUser(user.token, id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Ошибка при удалении пользователя');
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-container">
          <p className="admin-status">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="admin-container">
          <p className="admin-status admin-status--error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1 className="admin-title">Панель администратора</h1>

        <div className="admin-section">
          <h2 className="admin-section-title">
            Пользователи
            <span className="admin-count">{users.length}</span>
          </h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Пользователь</th>
                  <th>Email</th>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Роль</th>
                  <th>Дата регистрации</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className={u.role === 'admin' ? 'admin-row--highlight' : ''}>
                    <td className="td-id">{u.id}</td>
                    <td className="td-username">{u.userName}</td>
                    <td>{u.email}</td>
                    <td>{[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`role-chip ${u.role === 'admin' ? 'role-chip--admin' : ''}`}>
                        {u.role === 'admin' ? 'Админ' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="td-date">
                      {u.registeredOn
                        ? new Date(u.registeredOn).toLocaleDateString('ru-RU')
                        : '—'}
                    </td>
                    <td>
                      {u.id !== user?.id && (
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDelete(u.id, u.userName)}
                        >
                          Удалить
                        </button>
                      )}
                      {u.id === user?.id && (
                        <span className="td-self">Это вы</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
