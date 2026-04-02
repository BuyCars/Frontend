import '../styles/BrandsSection.css'
import bmw from '../assets/logos/bmw.png'
import mercedes from '../assets/logos/mercedes.png'
import audi from '../assets/logos/audi.png'
import toyota from '../assets/logos/toyota.png'
import volkswagen from '../assets/logos/volkswagen.png'

const BrandsSection = () => {

  const brands = [
    { name: "BMW", logo: bmw },
    { name: "Mercedes-Benz", logo: mercedes },
    { name: "Audi", logo: audi },
    { name: "Toyota", logo: toyota },
    { name: "Volkswagen", logo: volkswagen }
    //{ name: "Ford", logo: ford },
  ]

  return (
    <section className="brands-section">
      <h2>Популярные марки</h2>

      <div className="brands-grid">
        {brands.map(brand => (
          <div key={brand.name} className="brand-card">

            <div className="brand-logo">
              <img src={brand.logo} alt={brand.name} />
            </div>

            <p>{brand.name}</p>

          </div>
        ))}
      </div>
    </section>
  )
}

export default BrandsSection