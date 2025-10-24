import { useStore } from '../../store'
import type { OrderStatus } from '../../types'
import { useNavigate } from 'react-router-dom'

export default function Orders() {
  const { state, dispatch } = useStore()
  const nav = useNavigate()
  const setStatus = (id: string, status: OrderStatus) => dispatch({ type:'UPDATE_ORDER_STATUS', orderId:id, status })

  return (
    <div className="hw-card">
      <div className="hw-card-body">
        <h3 style={{ marginTop:0 }}>Orders</h3>
        <table className="hw-table">
          <thead>
            <tr><th>ID</th><th>Type</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {state.orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.type}</td>
                <td>{o.items.map(i=>`${i.productId}x${i.qty}`).join(', ')}</td>
                <td>${o.total.toFixed(2)}</td>
                <td>
                  <span className={`hw-badge ${o.status==='placed'?'placed':o.status==='in_progress'?'progress':'done'}`}>{o.status}</span>
                </td>
                <td className="hw-row">
                  <button className="hw-btn ghost" onClick={()=>setStatus(o.id,'placed')}>Placed</button>
                  <button className="hw-btn secondary" onClick={()=>setStatus(o.id,'in_progress')}>In progress</button>
                  <button className="hw-btn" onClick={()=>setStatus(o.id,'completed')}>Completed</button>
                </td>
              </tr>
            ))}
            {!state.orders.length && (
              <tr><td colSpan={6} style={{ color:'#9aa0aa' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
        <div className="hw-row" style={{ justifyContent:'flex-end', marginTop:8 }}>
          <button className="hw-btn secondary" onClick={()=>nav('/admin/inventory')}>Back to Inventory</button>
        </div>
      </div>
    </div>
  )
}