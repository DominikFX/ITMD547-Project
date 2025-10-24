export default function PriceTag({ msrp, sale }: { msrp?: number; sale?: number }) {
  if (sale == null && msrp == null) return null
  return (
    <div className="hw-row" style={{ justifyContent: 'space-between' }}>
      {sale != null && <div style={{ fontWeight: 800 }}>${sale.toFixed(2)}</div>}
      {msrp != null && <div style={{ color: '#94a3b8', textDecoration: sale ? 'line-through' : 'none' }}>${msrp.toFixed(2)}</div>}
    </div>
  )
}