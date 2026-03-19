import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";
import API from "../axios";

export default function Wishlist() {
  const { user } = useAuthStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    if (user?.id) {
      API.get(`/wishlist/${user.id}`)
        .then(res => setWishlist(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const remove = async (productId) => {
    await API.delete(`/wishlist/${user.id}/remove/${productId}`);
    setWishlist(w => w.filter(p => p.id !== productId));
  };

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8 flex items-center gap-3"><FiHeart className="text-red-400" /> Wishlist</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-24">
          <FiHeart size={64} className="mx-auto text-gray-600 mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">Wishlist is empty</h3>
          <p className="text-gray-400">Save products you love to view them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }} className="card p-4 flex flex-col">
              <img src={`${API.defaults.baseURL}/product/${product.id}/image`} alt={product.name} className="w-full h-40 object-contain rounded-xl bg-surface-light p-3 mb-3" onError={e=>e.target.src="/placeholder.png"} />
              <p className="text-xs text-brand-400 font-semibold mb-0.5">{product.brand}</p>
              <p className="font-semibold text-white flex-1 mb-3 line-clamp-2">{product.name}</p>
              <p className="text-xl font-bold text-white mb-3">${parseFloat(product.price).toFixed(2)}</p>
              <div className="flex gap-2">
                <button onClick={() => addToCart(product)} className="btn-primary flex-1 justify-center py-2 text-sm"><FiShoppingCart size={14} /> Add to Cart</button>
                <button onClick={() => remove(product.id)} className="btn-danger py-2 px-3"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
