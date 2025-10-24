import Hero from '../components/Hero'

export default function About() {
  return (
    <div className="hw-col" style={{ gap: 12 }}>
      <Hero
        title="About Hawk Warehouse"
        subtitle="We recirculate used furniture and provide event rentals for the Illinois Tech community."
        image="/images/hero-about.jpg"
      />
      <div className="hw-card">
        <div className="hw-card-body">
          <h3 style={{ marginTop: 0 }}>Contact</h3>
          <p>Email: hawkwarehouse@illinoistech.edu<br />Location: Mies Campus, Chicago, IL</p>
          <p style={{ color: '#64748b' }}>This is a demo app. No orders are actually fulfilled.</p>
        </div>
      </div>
    </div>
  )
}