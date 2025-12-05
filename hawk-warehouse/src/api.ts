import type { Order, Product } from './types'

const API_BASE = "https://hawk-api-c4dcd0dtbbescbgb.centralus-01.azurewebsites.net/api";// "http://localhost:5153/api";

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async addProduct(product: Product): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  },

  async updateProduct(product: Product): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) return [];
    return res.json();
  },

  async placeOrder(order: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to place order');
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status?status=${status}`, {
      method: 'PUT'
    });
    return res.json();
  },

  // Images
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  // Auth
  async login(token: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};