import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import '../styles/Header.css';

type ModalType = 'login' | 'register' | null;

const Header = () => {
  const { user, logout } = useAuth();
  const [modal, setModal] = useState<ModalType>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

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
                <span className="user-greeting">
                  {user.userName}
                  {user.role === 'admin' && <span className="role-badge">Админ</span>}
                </span>
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
