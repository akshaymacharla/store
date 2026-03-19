import { create } from 'zustand';
import API from '../axios';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  categories: [],

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await API.get('/products');
      set({ products: res.data, loading: false });
    } catch (err) {
      set({ error: 'Failed to load products', loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await API.get('/categories');
      set({ categories: res.data });
    } catch {
      // silently ignore
    }
  },

  searchProducts: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await API.get('/products/search', { params });
      // API returns a Page object, extract content
      set({ products: res.data.content || res.data, loading: false });
    } catch (err) {
      set({ error: 'Search failed', loading: false });
    }
  },
}));

export default useProductStore;
