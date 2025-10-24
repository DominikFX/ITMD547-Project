import type { Product } from '../types'

export const seedInventory: Product[] = [
  {
    id: 'CHAIR-001',
    type: 'catalog',
    name: 'Ergo Task Chair',
    category: 'Seating',
    priceMsrp: 249,
    priceSale: 65,
    stock: 8,
    image: '/images/placeholder-chair.jpg',
    description: 'Gently used. Adjustable height, tilt, and armrests.'
  },
  {
    id: 'DESK-002',
    type: 'catalog',
    name: 'Modern Study Desk',
    category: 'Tables',
    priceMsrp: 399,
    priceSale: 110,
    stock: 4,
    image: '/images/placeholder-table.jpg',
    description: 'Wood veneer top, cable grommet, sturdy metal legs.'
  },
  {
    id: 'TABLE-6FT',
    type: 'rental',
    name: '6ft Folding Table',
    category: 'Tables',
    rentalRatePerDay: 6,
    stock: 30,
    image: '/images/placeholder-table.jpg',
    description: 'Event folding table. Pickup only.'
  },
  {
    id: 'CHAIR-FOLD',
    type: 'rental',
    name: 'Folding Chair',
    category: 'Seating',
    rentalRatePerDay: 1.25,
    stock: 200,
    image: '/images/placeholder-chair.jpg',
    description: 'Simple, durable, stackable.'
  }
]