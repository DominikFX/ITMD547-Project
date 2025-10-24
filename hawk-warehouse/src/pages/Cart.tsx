import { Link } from 'react-router-dom'
import { useStore } from '../store'

export default function Cart() {
  const { state, dispatch } = useStore()
  const items = state.cart.map(ci => {
    const p = state.inventory.find(x => x.id === ci.productId)!
    const price = p.priceSale ?? p.priceMsrp ?? 0
    return { ...ci, name: p.name, price }
  })
  const total = items.reduce((s, x) => s + x.price * x.qty, 0)

  if (!items.length) {
    return (
      <div className="hw-col">
        <h2>Your cart is empty</h2>
        <Link to="/catalog" className="hw-btn">Browse catalog</Link>
      </div>
    )
  }

  return (
    <div className="hw-col" style={{ gap:16 }}>
      <h2>Cart</h2>
      <table className="hw-table">
        <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th><th></th></tr></thead>
        <tbody>
          {items.map(x => (
            <tr key={x.productId}>
              <td>{x.name}</td>
              <td>{x.qty}</td>
              <td>${x.price.toFixed(2)}</td>
              <td>${(x.price*x.qty).toFixed(2)}</td>
              <td><button className="hw-btn ghost" onClick={()=>dispatch({type:'REMOVE_FROM_CART', productId:x.productId})}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="hw-row" style={{ justifyContent:'space-between' }}>
        <div />
        <div><strong>Subtotal: ${total.toFixed(2)}</strong></div>
      </div>
      <div className="hw-row" style={{ justifyContent:'flex-end' }}>
        <button className="hw-btn secondary" onClick={()=>dispatch({type:'CLEAR_CART'})}>Clear</button>
        <button className="hw-btn" onClick={()=>dispatch({type:'PLACE_CATALOG_ORDER'})}>Place order (Pickup)</button>
      </div>
      <p style={{ color:'#9aa0aa', fontSize:12 }}>Pickup only. You’ll receive a confirmation email… in your imagination. This is a demo.</p>
    </div>
  )
}