import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { seedInventory } from './data/seed'
import type { CartItem, Order, StoreAction, StoreState } from './types'

const KEY = 'hawk-warehouse-state-v1'

const initialState: StoreState = (() => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as StoreState
  } catch { }
  return { inventory: seedInventory, cart: [], orders: [] }
})()

function totalForItems(items: { productId: string; qty: number }[], inventory: StoreState['inventory']) {
  return items.reduce((s, it) => {
    const p = inventory.find(x => x.id === it.productId)
    if (!p) return s
    const price = p.type === 'catalog' ? (p.priceSale ?? p.priceMsrp ?? 0) : (p.rentalRatePerDay ?? 0)
    return s + price * it.qty
  }, 0)
}

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.cart.find(c => c.productId === action.productId)
      const next: CartItem[] = exists
        ? state.cart.map(c => c.productId === action.productId ? { ...c, qty: c.qty + action.qty } : c)
        : [...state.cart, { productId: action.productId, qty: action.qty }]
      return { ...state, cart: next }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(c => c.productId !== action.productId) }
    case 'CLEAR_CART':
      return { ...state, cart: [] }

    case 'PLACE_CATALOG_ORDER': {
      // Only catalog items are in the cart for this flow
      const items = state.cart
      if (!items.length) return state
      // reduce stock
      const inventory = state.inventory.map(p => {
        const ci = items.find(i => i.productId === p.id)
        if (!ci) return p
        return { ...p, stock: Math.max(0, p.stock - ci.qty) }
      })
      const order: Order = {
        id: `ORD-${Date.now()}`,
        type: 'catalog',
        items: items.map(x => ({ ...x })),
        total: totalForItems(items, state.inventory),
        status: 'placed',
        createdAt: new Date().toISOString()
      }
      return { ...state, inventory, cart: [], orders: [order, ...state.orders] }
    }

    case 'PLACE_RENTAL_ORDER': {
      const { selections, meta } = action.payload
      if (!selections.length) return state
      const inventory = state.inventory.map(p => {
        const it = selections.find(i => i.productId === p.id)
        if (!it) return p
        return { ...p, stock: Math.max(0, p.stock - it.qty) }
      })
      const order: Order = {
        id: `RENT-${Date.now()}`,
        type: 'rental',
        items: selections.map(x => ({ ...x })),
        total: totalForItems(selections, state.inventory),
        status: 'placed',
        createdAt: new Date().toISOString(),
        meta
      }
      return { ...state, inventory, orders: [order, ...state.orders] }
    }

    case 'ADD_PRODUCT':
      return { ...state, inventory: [action.product, ...state.inventory] }

    case 'UPDATE_PRODUCT': {
      const inv = state.inventory.map(p => p.id === action.product.id ? { ...action.product } : p)
      return { ...state, inventory: inv }
    }

    case 'DELETE_PRODUCT': {
      const inv = state.inventory.filter(p => p.id !== action.productId)
      return { ...state, inventory: inv, cart: state.cart.filter(c => c.productId !== action.productId) }
    }

    default:
      return state
  }
}

const StoreCtx = createContext<{ state: StoreState; dispatch: React.Dispatch<StoreAction> } | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}