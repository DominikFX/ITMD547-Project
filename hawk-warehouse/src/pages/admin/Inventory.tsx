import { useState } from 'react'
import { useStore } from '../../store'
import type { Product } from '../../types'

function Editor({ initial, onSave, onCancel }: {
  initial: Product
  onSave: (p: Product) => void
  onCancel: () => void
}) {
  const [p, setP] = useState<Product>({ ...initial })
  return (
    <div className="hw-col" style={{ gap:8 }}>
      <div className="hw-grid" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))' }}>
        <input className="hw-input" value={p.name} onChange={e=>setP({...p, name:e.target.value})} placeholder="Name" />
        <input className="hw-input" value={p.category} onChange={e=>setP({...p, category:e.target.value})} placeholder="Category" />
        {p.type==='catalog' ? (
          <>
            <input className="hw-input" value={p.priceMsrp ?? ''} onChange={e=>setP({...p, priceMsrp:Number(e.target.value)||0})} placeholder="MSRP" />
            <input className="hw-input" value={p.priceSale ?? ''} onChange={e=>setP({...p, priceSale:Number(e.target.value)||0})} placeholder="Sale Price" />
          </>
        ) : (
          <input className="hw-input" value={p.rentalRatePerDay ?? ''} onChange={e=>setP({...p, rentalRatePerDay:Number(e.target.value)||0})} placeholder="Rate/day" />
        )}
        <input className="hw-input" value={p.stock} onChange={e=>setP({...p, stock:Number(e.target.value)||0})} placeholder="Stock" />
        <input className="hw-input" value={p.image} onChange={e=>setP({...p, image:e.target.value})} placeholder="Image URL" />
      </div>
      <textarea className="hw-textarea" value={p.description ?? ''} onChange={e=>setP({...p, description:e.target.value})} placeholder="Description" />
      <div className="hw-row" style={{ justifyContent:'flex-end' }}>
        <button className="hw-btn secondary" onClick={onCancel}>Cancel</button>
        <button className="hw-btn" onClick={()=>onSave(p)}>Save</button>
      </div>
    </div>
  )
}

export default function Inventory() {
  const { state, dispatch } = useStore()
  const catalog = state.inventory.filter(p => p.type === 'catalog')
  const rental = state.inventory.filter(p => p.type === 'rental')
  const [editing, setEditing] = useState<string | null>(null)

  const Row = ({ p }: { p: Product }) => (
    <tr>
      <td>{p.id}</td>
      <td>{p.name}</td>
      <td>{p.category}</td>
      <td>
        {p.type === 'catalog'
          ? <>${(p.priceSale ?? p.priceMsrp ?? 0).toFixed(2)} {p.priceMsrp && p.priceSale ? <span style={{ color:'#64748b' }}>(MSRP ${p.priceMsrp.toFixed(2)})</span> : null}</>
          : <>${(p.rentalRatePerDay ?? 0).toFixed(2)}/day</>}
      </td>
      <td>{p.stock}</td>
      <td className="hw-row">
        <button className="hw-btn secondary" onClick={()=>setEditing(p.id)}>Edit</button>
        <button className="hw-btn ghost" onClick={()=>dispatch({ type:'DELETE_PRODUCT', productId:p.id })}>Delete</button>
      </td>
    </tr>
  )

  const Table = ({ title, data }: { title: string; data: Product[] }) => (
    <div className="hw-card">
      <div className="hw-card-body">
        <h3 style={{ marginTop:0 }}>{title}</h3>
        <table className="hw-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Category</th><th>Price/Rate</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data.map(p => (
              editing === p.id
                ? <tr key={p.id}><td colSpan={6}>
                    <Editor
                      initial={p}
                      onSave={(np)=>{ dispatch({ type:'UPDATE_PRODUCT', product: np }); setEditing(null) }}
                      onCancel={()=>setEditing(null)}
                    />
                  </td></tr>
                : <Row key={p.id} p={p} />
            ))}
            {!data.length && (
              <tr><td colSpan={6} style={{ color:'#64748b' }}>No items.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="hw-col" style={{ gap:12 }}>
      <Table title="Catalog Inventory" data={catalog} />
      <Table title="Rental Inventory" data={rental} />
    </div>
  )
}