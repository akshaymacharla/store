import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import useCartStore from "../store/useCartStore";
import API from "../axios";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page-container py-24 text-center">
        <FiShoppingBag size={64} className="mx-auto text-gray-600 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some products to get started!</p>
        <Link to="/shop" className="btn-primary">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="card p-4 flex gap-4 items-center"
              >
                <img
                  src={`${API.defaults.baseURL}/product/${item.id}/image`}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded-xl bg-surface-light p-2"
                  onError={e => e.target.src = "/placeholder.png"}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-brand-400 font-semibold mb-0.5">{item.brand}</p>
                  <h3 className="text-white font-semibold line-clamp-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm">${parseFloat(item.price).toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-surface-light hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors">
                    <FiMinus size={14} />
                  </button>
                  <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-surface-light hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors">
                    <FiPlus size={14} />
                  </button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-white">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 transition-colors mt-1">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card p-6 sticky top-20">
            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal ({items.length} items)</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white text-lg">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate("/checkout")} className="btn-primary w-full justify-center py-3">
              Proceed to Checkout <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
