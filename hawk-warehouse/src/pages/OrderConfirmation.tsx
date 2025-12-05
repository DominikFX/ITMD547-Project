import { Link, useSearchParams } from 'react-router-dom'

export default function OrderConfirmation() {
  const [search] = useSearchParams()
  const type = search.get('type')
  const orderId = search.get('id')

  return (
    <div className="hw-page-center">
      <div className="hw-card hw-card-confirm">
        <div className="hw-card-body hw-col hw-confirm-body">
          <div>
            <h2 style={{ margin: '0 0 12px', fontSize: 24 }}>
              {type === 'rental' ? 'Request Received!' : 'Order Placed!'}
            </h2>
            <p className="hw-text-muted">
              {type === 'rental' ? (
                <>
                  Your rental request has been submitted. We will review your dates and inventory availability.
                  <br /><br />
                  Please check your email for approval status.
                </>
              ) : (
                <>
                  Thank you for your purchase. Your items have been reserved.
                  Please visit the warehouse during operating hours for pickup.
                </>
              )}
            </p>

            {type !== 'rental' && (
              <div style={{ marginTop: 24 }}>
                <span className="hw-tag" style={{ fontSize: 14, padding: '8px 16px' }}>
                  Order ID: <strong>{orderId || 'PENDING'}</strong>
                </span>
              </div>
            )}
          </div>
          <div className="hw-row" style={{ marginTop: 12 }}>
            <Link to="/" className="hw-btn secondary">Back Home</Link>
            <Link to={type === 'rental' ? "/rental" : "/catalog"} className="hw-btn">
              {type === 'rental' ? "New Request" : "Continue Shopping"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}