import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/catalog">Каталог</Link>
      </nav>
    </header>
  );
};

export default Header;