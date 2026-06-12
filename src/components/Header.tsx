import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { getAvatar } from '../utils/avatar';
import '../styles/Header.css';

type ModalType = 'login' | 'register' | null;

const Header = () => {
  const { user, logout } = useAuth();
  const [modal, setModal] = useState<ModalType>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setAvatarUrl(getAvatar(user.id));
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  useEffect(() => {
    const onAvatarUpdated = () => {
      if (user) setAvatarUrl(getAvatar(user.id));
    };
    window.addEventListener('avatar-updated', onAvatarUpdated);
    return () => window.removeEventListener('avatar-updated', onAvatarUpdated);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user
    ? user.userName[0].toUpperCase()
    : '';

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <h1>BuyCars</h1>
          </div>
          <nav className="nav-menu">
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/sell">Продать</Link>
            <Link to="/about">О нас</Link>
            <a href="#contact">Контакты</a>
            <Link to="/favorites" className="nav-favorites">Избранное</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-admin">Администрация</Link>
            )}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <Link to="/profile" className="user-greeting">
                  <span className="header-avatar">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={user.userName} className="header-avatar-img" />
                    ) : (
                      <span className="header-avatar-initials">{initials}</span>
                    )}
                  </span>
                  <span className="header-username">{user.userName}</span>
                  {user.role === 'admin' && <span className="role-badge">Админ</span>}
                </Link>
                <button className="btn-login" onClick={handleLogout}>
                  Выйти
                </button>
              </>
            ) : (
              <>
                <button className="btn-login" onClick={() => setModal('login')}>
                  Вход
                </button>
                <button className="btn-signup" onClick={() => setModal('register')}>
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {modal === 'login' && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToRegister={() => setModal('register')}
        />
      )}
      {modal === 'register' && (
        <RegisterModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal('login')}
        />
      )}
    </>
  );
};

export default Header;
