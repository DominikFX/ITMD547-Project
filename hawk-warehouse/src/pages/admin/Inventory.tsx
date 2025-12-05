import { useState } from 'react'
import { useStore } from '../../store'
import { api } from '../../api'
import type { Product } from '../../types'

function Editor({ initial, onSave, onCancel }: {
  initial: Product
  onSave: (p: Product) => void
  onCancel: () => void
}) {
  const [p, setP] = useState<Product>({ ...initial })
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true)
      try {
        const result = await api.uploadImage(e.target.files[0])
        setP(prev => ({ ...prev, image: result.url }))
      } catch (err) {
        alert("Failed to upload image")
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <div className="hw-col" style={{ gap: 8, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
      <div className="hw-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
        <input className="hw-input" value={p.name} onChange={e => setP({ ...p, name: e.target.value })} placeholder="Name" />
        <input className="hw-input" value={p.category} onChange={e => setP({ ...p, category: e.target.value })} placeholder="Category" />
        {p.type === 'catalog' ? (
          <>
            <input className="hw-input" value={p.priceMsrp ?? ''} onChange={e => setP({ ...p, priceMsrp: Number(e.target.value) || 0 })} placeholder="MSRP" />
            <input className="hw-input" value={p.priceSale ?? ''} onChange={e => setP({ ...p, priceSale: Number(e.target.value) || 0 })} placeholder="Sale Price" />
          </>
        ) : (
          <input className="hw-input" value={p.rentalRatePerDay ?? ''} onChange={e => setP({ ...p, rentalRatePerDay: Number(e.target.value) || 0 })} placeholder="Rate/day" />
        )}
        <input className="hw-input" value={p.stock} onChange={e => setP({ ...p, stock: Number(e.target.value) || 0 })} placeholder="Stock" />
        <div className="hw-col">
          <label style={{ fontSize: 12, fontWeight: 'bold', color: '#64748b' }}>Replace Image</label>
          <div className="hw-row" style={{ gap: 8 }}>
            <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid #ddd' }} />
            <input type="file" className="hw-input" onChange={handleFileChange} accept="image/*" style={{ padding: 6, fontSize: 12, flex: 1 }} />
          </div>
          {uploading && <small style={{ color: 'blue' }}>Uploading to Azure...</small>}
        </div>
      </div>
      <textarea className="hw-textarea" value={p.description ?? ''} onChange={e => setP({ ...p, description: e.target.value })} placeholder="Description" />
      <div className="hw-row" style={{ justifyContent: 'flex-end' }}>
        <button className="hw-btn secondary" onClick={onCancel}>Cancel</button>
        <button className="hw-btn" onClick={() => onSave(p)} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Changes'}
        </button>
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
          ? <>${(p.priceSale ?? p.priceMsrp ?? 0).toFixed(2)} {p.priceMsrp && p.priceSale ? <span style={{ color: '#64748b' }}>(MSRP ${p.priceMsrp.toFixed(2)})</span> : null}</>
          : <>${(p.rentalRatePerDay ?? 0).toFixed(2)}/day</>}
      </td>
      <td>{p.stock}</td>
      <td className="hw-row">
        <button className="hw-btn secondary" onClick={() => setEditing(p.id)}>Edit</button>
        <button className="hw-btn ghost" onClick={() => dispatch({ type: 'DELETE_PRODUCT', productId: p.id })}>Delete</button>
      </td>
    </tr>
  )

  const Table = ({ title, data }: { title: string; data: Product[] }) => (
    <div className="hw-card">
      <div className="hw-card-body">
        <h3 style={{ marginTop: 0 }}>{title}</h3>
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
                    onSave={(np) => { dispatch({ type: 'UPDATE_PRODUCT', product: np }); setEditing(null) }}
                    onCancel={() => setEditing(null)}
                  />
                </td></tr>
                : <Row key={p.id} p={p} />
            ))}
            {!data.length && (
              <tr><td colSpan={6} style={{ color: '#64748b' }}>No items.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="hw-col" style={{ gap: 12 }}>
      <Table title="Catalog Inventory" data={catalog} />
      <Table title="Rental Inventory" data={rental} />
    </div>
  )
}