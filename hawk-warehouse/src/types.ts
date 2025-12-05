export type ProductType = 'catalog' | 'rental'

export interface Product {
  id: string
  type: ProductType
  name: string
  category: string
  priceMsrp?: number
  priceSale?: number
  rentalRatePerDay?: number
  stock: number
  image: string
  description?: string
}

export interface CartItem {
  productId: string
  qty: number
}

export type OrderStatus = 'placed' | 'in_progress' | 'completed'
export type OrderType = 'catalog' | 'rental'

export interface Order {
  id: string
  type: OrderType
  items: { productId: string; qty: number }[]
  total: number
  status: OrderStatus
  createdAt: string
  meta?: Record<string, string>
}

export interface StoreState {
  inventory: Product[]
  cart: CartItem[]
  orders: Order[]
  isAdmin: boolean
}

export type StoreAction =
  | { type: 'SET_INVENTORY'; payload: Product[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_TO_CART'; productId: string; qty: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_CATALOG_ORDER' }
  | { type: 'PLACE_RENTAL_ORDER'; payload: { selections: { productId: string; qty: number }[]; meta: Record<string, string> } }
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product }
  | { type: 'DELETE_PRODUCT'; productId: string }
  | { type: 'UPDATE_ORDER_STATUS'; orderId: string; status: OrderStatus }
  | { type: 'LOGIN_ADMIN' }
  | { type: 'LOGOUT_ADMIN' }