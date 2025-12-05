import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { api } from '../../api'
import type { Product, ProductType } from '../../types'

export default function AddProduct() {
  const { dispatch } = useStore()
  const nav = useNavigate()
  const [type, setType] = useState<ProductType>('catalog')
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    id: '',
    name: '',
    category: '',
    priceMsrp: '',
    priceSale: '',
    rentalRatePerDay: '',
    stock: '0',
    image: '',
    description: ''
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const result = await api.uploadImage(e.target.files[0]);
        setForm(prev => ({ ...prev, image: result.url }));
      } catch (err) {
        alert("Failed to upload image");
      } finally {
        setUploading(false);
      }
    }
  }

  const submit = () => {
    if (!form.id || !form.name || !form.category) return

    const product: Product = {
      id: form.id,
      type,
      name: form.name,
      category: form.category,
      priceMsrp: type === 'catalog' && form.priceMsrp ? Number(form.priceMsrp) : undefined,
      priceSale: type === 'catalog' && form.priceSale ? Number(form.priceSale) : undefined,
      rentalRatePerDay: type === 'rental' && form.rentalRatePerDay ? Number(form.rentalRatePerDay) : undefined,
      stock: Number(form.stock) || 0,
      image: form.image || 'https://placehold.co/400',
      description: form.description
    }
    dispatch({ type: 'ADD_PRODUCT', product })
    nav('/admin/inventory')
  }

  return (
    <div className="hw-card">
      <div className="hw-card-body hw-col">
        <h3 style={{ marginTop: 0 }}>Add Product</h3>
        <div className="hw-row" style={{ flexWrap: 'wrap' }}>
          <label className="hw-row">Type
            <select className="hw-select" value={type} onChange={e => setType(e.target.value as ProductType)}>
              <option value="catalog">Catalog (for sale)</option>
              <option value="rental">Rental</option>
            </select>
          </label>
        </div>
        <div className="hw-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          <input className="hw-input" placeholder="ID (unique e.g. CHAIR-001)" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
          <input className="hw-input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="hw-input" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          {type === 'catalog' && <>
            <input className="hw-input" placeholder="MSRP" value={form.priceMsrp} onChange={e => setForm({ ...form, priceMsrp: e.target.value })} />
            <input className="hw-input" placeholder="Sale Price" value={form.priceSale} onChange={e => setForm({ ...form, priceSale: e.target.value })} />
          </>}
          {type === 'rental' && <>
            <input className="hw-input" placeholder="Rate per day" value={form.rentalRatePerDay} onChange={e => setForm({ ...form, rentalRatePerDay: e.target.value })} />
          </>}
          <input className="hw-input" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />

          <div className="hw-col">
            <label style={{ fontSize: 12, fontWeight: 'bold', color: '#666' }}>Product Image</label>
            <input type="file" className="hw-input" onChange={handleFileChange} accept="image/*" />
            {uploading && <div style={{ fontSize: 12, color: 'blue' }}>Uploading to Azure...</div>}
            {form.image && <div style={{ fontSize: 12, color: 'green' }}>Image uploaded!</div>}
          </div>

        </div>
        <textarea className="hw-textarea" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div className="hw-row" style={{ justifyContent: 'flex-end' }}>
          <button className="hw-btn secondary" onClick={() => nav('/admin/inventory')}>Cancel</button>
          <button className="hw-btn" onClick={submit} disabled={uploading}>Add</button>
        </div>
      </div>
    </div>
  )
}