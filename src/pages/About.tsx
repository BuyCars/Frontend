import '../styles/About.css';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="about-kicker">BuyCars · О компании</p>
          <h1>Покупка автомобиля должна быть уверенной, а не случайной</h1>
          <p>
            Мы объединяем понятный каталог, детальные карточки и удобное
            избранное, чтобы вы сравнивали предложения спокойно и принимали
            решение без спешки.
          </p>

          <div className="about-hero-actions">
            <Link to="/catalog" className="about-btn about-btn-primary">
              Смотреть каталог
            </Link>
            <Link to="/favorites" className="about-btn about-btn-ghost">
              Открыть избранное
            </Link>
          </div>

          <div className="about-proof" aria-label="Ключевые факты о сервисе">
            <div className="proof-item">
              <strong>2 000+</strong>
              <span>активных объявлений</span>
            </div>
            <div className="proof-item">
              <strong>98%</strong>
              <span>довольных пользователей</span>
            </div>
            <div className="proof-item">
              <strong>24/7</strong>
              <span>доступ к подбору</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section about-story">
        <div className="about-story-text">
          <p className="about-section-kicker">Наша история</p>
          <h2>Начали с простого вопроса: почему выбор авто такой утомительный?</h2>
          <p>
            Мы увидели, как много времени люди тратят на хаотичный поиск между
            разными объявлениями. Поэтому сделали сервис, где главное -
            прозрачность: характеристики на виду, фильтры работают быстро,
            а понравившиеся модели сохраняются в один клик.
          </p>
        </div>

        <aside className="about-story-panel" aria-label="Этапы развития BuyCars">
          <h3>Как мы развиваемся</h3>
          <ul>
            <li>
              <span>2024</span>
              <p>Запуск первой версии каталога и карточек автомобилей.</p>
            </li>
            <li>
              <span>2025</span>
              <p>Добавили избранное и расширили систему фильтров.</p>
            </li>
            <li>
              <span>2026</span>
              <p>Усилили UX и сделали платформу быстрее на мобильных.</p>
            </li>
          </ul>
        </aside>
      </section>

      <section className="about-section">
        <p className="about-section-kicker">Принципы</p>
        <h2 className="about-section-title">Что для нас важно в каждом релизе</h2>
        <div className="about-grid about-values-grid">
          <article className="about-card about-value-card">
            <h3>Прозрачность</h3>
            <p>
              Максимум полезных деталей прямо в карточке автомобиля, без
              скрытой информации и лишних шагов.
            </p>
          </article>

          <article className="about-card about-value-card">
            <h3>Скорость выбора</h3>
            <p>
              Фильтры и каталог работают так, чтобы вы находили подходящую
              модель за минуты, а не за вечер.
            </p>
          </article>

          <article className="about-card about-value-card">
            <h3>Практичный дизайн</h3>
            <p>
              Мы проектируем интерфейс для реальных сценариев: с телефона,
              ноутбука и в условиях ограниченного времени.
            </p>
          </article>
        </div>
      </section>


      <section className="about-cta" aria-label="Призыв к действию">
        <div className="about-cta-inner">
          <h2>Готовы выбрать автомобиль без хаоса?</h2>
          <p>
            Перейдите в каталог и сохраните подходящие варианты в избранное,
            чтобы сравнить их в спокойном темпе.
          </p>
          <div className="about-cta-actions">
            <Link to="/catalog" className="about-btn about-btn-primary">
              Перейти в каталог
            </Link>
            <Link to="/favorites" className="about-btn about-btn-ghost about-btn-light">
              Мои избранные
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
