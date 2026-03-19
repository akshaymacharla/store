import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar } from "react-icons/fi";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import API from "../axios";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    API.get(`/product/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error("Please login to use wishlist"); return; }
    setWishlistLoading(true);
    try {
      await API.post(`/wishlist/${user.id}/add/${id}`);
      toast.success("Added to wishlist!");
    } catch { toast.error("Failed to add to wishlist"); }
    setWishlistLoading(false);
  };

  if (loading) return (
    <div className="page-container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="skeleton h-96 rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-1/3 rounded" />
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-10 w-1/4 rounded" />
          <div className="skeleton h-24 w-full rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="page-container py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-8 flex items-center justify-center min-h-[400px]">
          <img src={`${API.defaults.baseURL}/product/${id}/image`} alt={product.name} className="max-h-80 object-contain" onError={e => e.target.src="/placeholder.png"} />
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div>
            <p className="text-brand-400 font-semibold text-sm uppercase tracking-wider mb-1">{product.brand}</p>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <FiStar key={i} size={16} className={i < 4 ? "text-yellow-400" : "text-gray-600"} />)}
            <span className="text-gray-400 text-sm ml-1">(4.0) · {product.stockQuantity || 0} in stock</span>
          </div>

          <p className="text-4xl font-bold text-white">${parseFloat(product.price).toFixed(2)}</p>

          <p className="text-gray-400 leading-relaxed">{product.description || "No description available."}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => addToCart(product)}
              disabled={!product.productAvailable}
              className="btn-primary flex-1 justify-center py-3.5 text-base"
            >
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="btn-ghost px-4 py-3.5"
            >
              <FiHeart size={18} className={wishlistLoading ? "animate-pulse text-red-400" : ""} />
            </button>
          </div>

          {!product.productAvailable && (
            <p className="text-red-400 text-sm flex items-center gap-2">⚠️ This product is currently out of stock.</p>
          )}

          <div className="grid grid-cols-2 gap-3 pt-4">
            {product.category && (
              <div className="card p-3 text-center"><p className="text-xs text-gray-400 mb-1">Category</p><p className="font-semibold text-white text-sm">{product.category}</p></div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
