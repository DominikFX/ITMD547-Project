import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import PriceTag from '../components/PriceTag'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useStore()
  const p = state.inventory.find(x => x.id === id)

  if (!p) return <div style={{ padding: 40, textAlign: 'center' }}>Product not found.</div>

  return (
    <div className="hw-detail-container">
      <div>
        <button onClick={() => navigate(-1)} className="hw-btn ghost hw-btn-back">
          ← Back
        </button>
      </div>
      <div className="hw-detail-grid">
        <div className="hw-detail-image-col">
          <img src={p.image} alt={p.name} className="hw-detail-image" />
        </div>
        <div className="hw-detail-info-col">
          <h1 className="hw-detail-title">{p.name}</h1>
          <div className="hw-detail-category">{p.category}</div>
          <div className="spacer" />
          {p.type === 'catalog'
            ? <div className="hw-detail-price"><PriceTag msrp={p.priceMsrp} sale={p.priceSale} /></div>
            : <div className="hw-detail-price">${(p.rentalRatePerDay ?? 0).toFixed(2)}<span className="hw-detail-rate-suffix">/day</span></div>}

          <div className="spacer" />
          <p className="hw-detail-desc">
            {p.description ?? 'No description provided.'}
          </p>
          <div className="spacer" />
          <div className="hw-detail-stock">
            Availability: {p.stock > 0
              ? <span className="hw-stock-ok">{p.stock} in stock</span>
              : <span className="hw-stock-low">Out of stock</span>}
          </div>

          {p.type === 'catalog' && (
            <div className="hw-row">
              <button
                className="hw-btn hw-btn-add"
                disabled={p.stock <= 0}
                onClick={() => dispatch({ type: 'ADD_TO_CART', productId: p.id, qty: 1 })}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}