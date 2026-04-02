import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/" className="header-logo">
          BuyCars
        </Link>

        <div className="header-links">
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;