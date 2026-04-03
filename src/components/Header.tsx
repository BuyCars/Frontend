import '../styles/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1> BuyCars</h1>
        </div>
        <nav className="nav-menu">
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
          <a href="#about">О нас</a>
          <a href="#contact">Контакты</a>
          <Link to="/favorites" className="nav-favorites">❤️ Избранные</Link>
        </nav>
        <div className="header-actions">
          <button className="btn-login">Вход</button>
          <button className="btn-signup">Регистрация</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
