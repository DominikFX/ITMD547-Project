import { Link } from 'react-router-dom'
import { useStore } from '../store'
import PriceTag from './PriceTag'
import type { Product } from '../types'

export default function ProductCard({ p }: { p: Product }) {
  const { dispatch } = useStore()
  const canBuy = p.type === 'catalog'
  const price = p.type === 'catalog' ? p.priceSale ?? p.priceMsrp : undefined
  return (
    <div className="hw-card">
      <Link to={`/product/${p.id}`}><img src={p.image} alt={p.name} /></Link>
      <div className="hw-card-body">
        <div className="hw-row" style={{ justifyContent:'space-between' }}>
          <strong>{p.name}</strong>
          <span className="hw-tag">{p.category}</span>
        </div>
        <div style={{ height: 8 }} />
        {p.type === 'catalog'
          ? <PriceTag msrp={p.priceMsrp} sale={p.priceSale} />
          : <div className="hw-row"><strong>${(p.rentalRatePerDay ?? 0).toFixed(2)}/day</strong></div>}
        <div style={{ height: 8 }} />
        <div className="hw-row">
          <Link to={`/product/${p.id}`} className="hw-btn secondary">Details</Link>
          {canBuy && (
            <button
              className="hw-btn"
              disabled={p.stock <= 0}
              onClick={() => dispatch({ type: 'ADD_TO_CART', productId: p.id, qty: 1 })}
            >
              Add to cart
            </button>
          )}
        </div>
        <div style={{ marginTop: 8, color: '#a1a1aa', fontSize: 12 }}>
          Stock: {p.stock}
        </div>
      </div>
    </div>
  )
}