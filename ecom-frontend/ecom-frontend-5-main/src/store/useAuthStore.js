import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '../axios';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const res = await API.post('/auth/login', { email, password });
          const { token, user } = res.data;
          set({ user, token, isAuthenticated: true });
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          toast.success(`Welcome back, ${user.fullName}!`);
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed';
          toast.error(msg);
          return { success: false, error: msg };
        }
      },

      register: async (fullName, email, password) => {
        try {
          await API.post('/auth/register', { fullName, email, password });
          toast.success('Account created! Please log in.');
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed';
          toast.error(msg);
          return { success: false, error: msg };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete API.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully');
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Rehydrate the Axios Authorization header on page load
        if (state?.token) {
          API.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      },
    }
  )
);

export default useAuthStore;
