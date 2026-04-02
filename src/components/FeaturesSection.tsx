import '../styles/FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h2>Почему выбирают buyCars</h2>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">✓</div>
          <h3>Проверенные продавцы</h3>
          <p>Все автомобили проходят проверку перед размещением</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Лучшие цены</h3>
          <p>Конкурентные предложения от частных лиц и дилеров</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Быстрая продажа</h3>
          <p>Реальные покупатели, готовые купить прямо сейчас</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Безопасность</h3>
          <p>Защита данных и безопасные платежи</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📞</div>
          <h3>Поддержка 24/7</h3>
          <p>Помощь на каждом этапе покупки/продажи</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🚗</div>
          <h3>Доставка</h3>
          <p>Организуем доставку автомобиля до вас</p>
        </div>
      </div>

      <div className="cta-section">
        <h3>Готовы начать?</h3>
        <p>Продайте авто за считанные минуты или найдите свой идеальный автомобиль</p>
        <div className="cta-buttons">
          <button className="btn-sell">Продать авто</button>
          <button className="btn-buy">Купить авто</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;