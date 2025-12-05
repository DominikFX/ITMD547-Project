import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { api } from './api'
import type { CartItem, Product, StoreAction, StoreState } from './types'

const initialState: StoreState = {
  inventory: [],
  cart: [],
  orders: [],
  isAdmin: false,
  isInitialized: false
}

function totalForItems(items: { productId: string; qty: number }[], inventory: Product[]) {
  return items.reduce((s, it) => {
    const p = inventory.find(x => x.id === it.productId)
    if (!p) return s
    const price = p.type === 'catalog' ? (p.priceSale ?? p.priceMsrp ?? 0) : (p.rentalRatePerDay ?? 0)
    return s + price * it.qty
  }, 0)
}

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'LOGIN_ADMIN': return { ...state, isAdmin: true }
    case 'LOGOUT_ADMIN': return { ...state, isAdmin: false }

    case 'SET_INVENTORY': return { ...state, inventory: action.payload, isInitialized: true }
    case 'SET_ORDERS': return { ...state, orders: action.payload }

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

    case 'PLACE_CATALOG_ORDER': return state
    case 'PLACE_RENTAL_ORDER': return state
    case 'ADD_PRODUCT': return { ...state, inventory: [action.product, ...state.inventory] }
    case 'UPDATE_PRODUCT': return { ...state, inventory: state.inventory.map(p => p.id === action.product.id ? { ...action.product } : p) }
    case 'DELETE_PRODUCT': return { ...state, inventory: state.inventory.filter(p => p.id !== action.productId), cart: state.cart.filter(c => c.productId !== action.productId) }
    case 'UPDATE_ORDER_STATUS': return { ...state, orders: state.orders.map(o => o.id === action.orderId ? { ...o, status: action.status } : o) }

    default: return state
  }
}

const StoreCtx = createContext<{ state: StoreState; dispatch: React.Dispatch<StoreAction> } | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    const load = async () => {
      try {
        const prods = await api.getProducts();
        dispatch({ type: 'SET_INVENTORY', payload: prods });

        const ords = await api.getOrders();
        dispatch({ type: 'SET_ORDERS', payload: ords });
      } catch (err) {
        console.error("Wake up failed", err);
      }
    };
    load();
  }, [])

  const dispatchWrapper = async (action: StoreAction) => {

    if (action.type === 'PLACE_CATALOG_ORDER') {
      const items = state.cart;
      if (!items.length) return;

      try {
        const createdOrder = await api.placeOrder({
          type: 'catalog',
          items,
          total: totalForItems(items, state.inventory)
        });

        dispatch({ type: 'CLEAR_CART' });

        const [inv, ords] = await Promise.all([api.getProducts(), api.getOrders()]);
        dispatch({ type: 'SET_INVENTORY', payload: inv });
        dispatch({ type: 'SET_ORDERS', payload: ords });

        window.location.assign(`/order-confirmation?type=catalog&id=${createdOrder.id}`);
      } catch (err) {
        console.error(err);
        alert("Failed to place order. Please try again.");
      }
      return;
    }

    if (action.type === 'PLACE_RENTAL_ORDER') {
      const { selections, meta } = action.payload;
      try {
        await api.placeOrder({
          type: 'rental',
          items: selections,
          total: totalForItems(selections, state.inventory),
          meta: meta as any
        });
        const ords = await api.getOrders();
        dispatch({ type: 'SET_ORDERS', payload: ords });

        window.location.assign('/order-confirmation?type=rental');
      } catch (err) {
        alert("Failed to submit rental request.");
      }
      return;
    }

    dispatch(action);

    try {
      if (action.type === 'ADD_PRODUCT') await api.addProduct(action.product);
      if (action.type === 'UPDATE_PRODUCT') await api.updateProduct(action.product);
      if (action.type === 'DELETE_PRODUCT') await api.deleteProduct(action.productId);
      if (action.type === 'UPDATE_ORDER_STATUS') await api.updateOrderStatus(action.orderId, action.status);
    } catch (err) {
      console.error("API Action Failed:", err);
    }
  };

  const value = useMemo(() => ({ state, dispatch: dispatchWrapper }), [state])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}