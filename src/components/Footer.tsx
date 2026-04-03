import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>О BuyCars</h3>
          <ul>
            <li><a href="#about">О компании</a></li>
            <li><a href="#blog">Блог</a></li>
            <li><a href="#press">Пресса</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Покупателям</h3>
          <ul>
            <li><a href="#buy">Купить авто</a></li>
            <li><a href="#financing">Финансирование</a></li>
            <li><a href="#insurance">Страховка</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Продавцам</h3>
          <ul>
            <li><a href="#sell">Продать авто</a></li>
            <li><a href="#pricing">Тарифы</a></li>
            <li><a href="#help">Помощь</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Контакты</h3>
          <p>Email: info@buycars.com</p>
          <p>Телефон: +1-800-CARS</p>
          <p>Адрес: 123 Auto Street, Car City</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 BuyCars. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
