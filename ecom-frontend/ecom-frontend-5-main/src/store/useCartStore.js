import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const { items } = get();
        const exists = items.find((i) => i.id === product.id);
        if (exists) {
          set({ items: items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
        toast.success(`${product.name} added to cart!`);
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter((i) => i.id !== productId) });
        toast.success('Removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) { get().removeFromCart(productId); return; }
        set({ items: get().items.map((i) => i.id === productId ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => get().items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0),
      
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);

export default useCartStore;
