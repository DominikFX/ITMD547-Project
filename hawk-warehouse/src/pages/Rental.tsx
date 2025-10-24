import { useState } from 'react'
import { useStore } from '../store'
import type { Product } from '../types'
import Hero from '../components/Hero'


type Sel = { productId: string; qty: number }

export default function Rental() {
  const { state, dispatch } = useStore()
  const rentals = state.inventory.filter(p => p.type === 'rental')

  const [selections, setSelections] = useState<Sel[]>([])
  const [meta, setMeta] = useState({
    contactName:'',
    contactEmail:'',
    orgUnit:'Illinois Tech Department',
    building:'',
    room:'',
    eventName:'',
    startDate:'',
    endDate:''
  })

  const setQty = (p: Product, qty: number) => {
    qty = Math.max(0, Math.min(qty, p.stock))
    setSelections(prev => {
      const exists = prev.find(x => x.productId === p.id)
      if (!exists && qty === 0) return prev
      if (!exists) return [...prev, { productId: p.id, qty }]
      return prev.map(x => x.productId === p.id ? { ...x, qty } : x).filter(x => x.qty>0)
    })
  }

  const submit = () => {
    const clean = selections.filter(s => s.qty>0)
    if (!clean.length) return
    if (!meta.contactName || !meta.contactEmail || !meta.building || !meta.startDate || !meta.endDate) return
    dispatch({ type:'PLACE_RENTAL_ORDER', payload:{ selections: clean, meta } })
    setSelections([]); // reset
  }

  return (
    <>
      <Hero
        title="Rental"
        subtitle="Tables, chairs, and event equipment for Illinois Tech. University-only. Pickup only."
        image="/images/hero-rental.jpg"
      />

      <div className="hw-col" style={{ gap:18 }}>
        <div className="hw-grid">
          {rentals.map(p => (
            <div className="hw-card" key={p.id}>
              <img src={p.image} alt={p.name} />
              <div className="hw-card-body">
                <div className="hw-row" style={{ justifyContent:'space-between' }}>
                  <strong>{p.name}</strong>
                  <span className="hw-tag">{p.category}</span>
                </div>
                <div style={{ height:8 }} />
                <div>${(p.rentalRatePerDay ?? 0).toFixed(2)}/day</div>
                <div style={{ color:'#a1a1aa', fontSize:12 }}>Available: {p.stock}</div>
                <div style={{ height:8 }} />
                <div className="hw-row">
                  <button className="hw-btn secondary" onClick={()=>setQty(p, Math.max(0, (selections.find(x=>x.productId===p.id)?.qty ?? 0)-1))}>-</button>
                  <div style={{ minWidth:36, textAlign:'center' }}>{selections.find(x=>x.productId===p.id)?.qty ?? 0}</div>
                  <button className="hw-btn" onClick={()=>setQty(p, (selections.find(x=>x.productId===p.id)?.qty ?? 0)+1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hw-card">
          <div className="hw-card-body">
            <h3 style={{ marginTop:0 }}>Request details</h3>
            <div className="hw-grid" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))' }}>
              <div className="hw-col">
                <label>Name</label>
                <input className="hw-input" value={meta.contactName} onChange={e=>setMeta({...meta, contactName:e.target.value})}/>
              </div>
              <div className="hw-col">
                <label>Email</label>
                <input className="hw-input" value={meta.contactEmail} onChange={e=>setMeta({...meta, contactEmail:e.target.value})}/>
              </div>
              <div className="hw-col">
                <label>Building</label>
                <input className="hw-input" value={meta.building} onChange={e=>setMeta({...meta, building:e.target.value})}/>
              </div>
              <div className="hw-col">
                <label>Room</label>
                <input className="hw-input" value={meta.room} onChange={e=>setMeta({...meta, room:e.target.value})}/>
              </div>
              <div className="hw-col">
                <label>Event name</label>
                <input className="hw-input" value={meta.eventName} onChange={e=>setMeta({...meta, eventName:e.target.value})}/>
              </div>
              <div className="hw-col">
                <label>Start date</label>
                <input type="date" className="hw-input" value={meta.startDate} onChange={e=>setMeta({...meta, startDate:e.target.value})}/>
              </div>
              <div className="hw-col">
                <label>End date</label>
                <input type="date" className="hw-input" value={meta.endDate} onChange={e=>setMeta({...meta, endDate:e.target.value})}/>
              </div>
            </div>
            <div style={{ height:12 }} />
            <button className="hw-btn" disabled={!selections.length} onClick={submit}>Submit rental request</button>
            <p style={{ color:'#9aa0aa', fontSize:12, marginTop:8 }}>We rent only to Illinois Tech departments and registered orgs. Pickup only.</p>
          </div>
        </div>
      </div>
    </>
  )
}