import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useStore } from '../store'
import Hero from '../components/Hero'

export default function Catalog() {
  const { state } = useStore()
  const [q, setQ] = useState('')

  const items = useMemo(() => {
    const base = state.inventory.filter(p => p.type === 'catalog')
    if (!q.trim()) return base
    const s = q.toLowerCase()
    return base.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      (p.description ?? '').toLowerCase().includes(s)
    )
  }, [state.inventory, q])

  if (!state.isInitialized) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
        <h2>Connecting to Azure Cloud...</h2>
        <p>Checking rental availability (this may take up to 30s)...</p>
      </div>
    )
  }

  return (
    <>
      <Hero
        title="Catalog"
        subtitle="Used furniture at student-friendly prices. Pickup only."
        image="/images/hero-catalog.jpg"
      />
      <div className="hw-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <input
          className="hw-input"
          style={{ minWidth: 280 }}
          placeholder="Search by name, category, or description…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ color: '#64748b', fontSize: 12 }}>
          {items.length} results
        </div>
      </div>
      <div className="hw-grid">
        {items.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  )
}