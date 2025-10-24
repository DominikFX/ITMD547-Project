export default function Hero({
  title,
  subtitle,
  image
}: {
  title: string
  subtitle?: string
  image?: string
}) {
  return (
    <section className="hw-hero">
      <div className="hw-hero-inner">
        <div className="hw-hero-copy">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {image ? (
          <img
            src={image}
            alt=""
            className="hw-hero-img"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : null}
      </div>
    </section>
  )
}