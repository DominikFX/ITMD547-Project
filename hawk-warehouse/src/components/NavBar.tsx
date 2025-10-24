export default function NavBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="hw-topbar">
      <div className="hw-brand">
        <span className="hw-logo" aria-hidden />
        <div>
          <div className="hw-title">Hawk Warehouse</div>
          <div className="hw-sub">Illinois Tech</div>
        </div>
      </div>
      {children}
    </header>
  )
}