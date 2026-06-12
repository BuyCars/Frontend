import { Link } from 'react-router-dom';
import FeaturesSection from '../components/FeaturesSection';
import BrandsSection from '../components/BrandsSection';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>BuyCars</h1>
          <p>Покупка и продажа автомобилей</p>
          <div className="hero-buttons">
            <Link to="/catalog" className="btn-primary">
              Купить авто
            </Link>
            <Link to="/sell" className="btn-secondary">
              Продать авто
            </Link>
          </div>
        </div>
      </section>

      <div className="main-container">
        <FeaturesSection />
        <BrandsSection />
      </div>
    </div>
  );
};

export default Home;