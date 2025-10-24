import { useParams } from 'react-router-dom'
import { useStore } from '../store'
import PriceTag from '../components/PriceTag'

export default function ProductDetail() {
  const { id } = useParams()
  const { state, dispatch } = useStore()
  const p = state.inventory.find(x => x.id === id)
  if (!p) return <div>Product not found.</div>
  return (
    <div className="hw-row" style={{ gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <img src={p.image} alt={p.name} style={{ width: 420, maxWidth: '100%', borderRadius: 16, border: '1px solid #24242a' }} />
      <div className="hw-col" style={{ maxWidth: 520 }}>
        <h2 style={{ margin: 0 }}>{p.name}</h2>
        <div style={{ color: '#a1a1aa' }}>{p.category}</div>
        <div style={{ height: 10 }} />
        {p.type === 'catalog'
          ? <PriceTag msrp={p.priceMsrp} sale={p.priceSale} />
          : <div><strong>${(p.rentalRatePerDay ?? 0).toFixed(2)}/day</strong></div>}
        <div style={{ height: 10 }} />
        <p style={{ lineHeight: 1.5 }}>{p.description ?? 'No description provided.'}</p>
        <div style={{ color: '#a1a1aa', fontSize: 12 }}>Stock: {p.stock}</div>
        {p.type === 'catalog' && (
          <div className="hw-row">
            <button className="hw-btn" disabled={p.stock <= 0}
              onClick={() => dispatch({ type: 'ADD_TO_CART', productId: p.id, qty: 1 })}
            >Add to cart</button>
          </div>
        )}
      </div>
    </div>
  )
}