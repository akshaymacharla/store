import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCreditCard, FiCheckCircle } from "react-icons/fi";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import API from "../axios";
import toast from "react-hot-toast";

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [paymentToken, setPaymentToken] = useState("tok_visa");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("No items in cart!"); return; }
    setLoading(true);
    try {
      const orderPayload = {
        userId: user.id,
        paymentToken,
        items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
      };
      await API.post('/orders', orderPayload);
      clearCart();
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data || "Order placement failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="page-container py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-green-400" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Order Placed! 🎉</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Thank you for your purchase. Your order has been confirmed and is being processed.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate("/orders")} className="btn-primary">View Orders</button>
          <button onClick={() => navigate("/shop")} className="btn-ghost">Continue Shopping</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FiCreditCard className="text-brand-400" /> Payment Information
          </h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">CARDHOLDER NAME</label>
              <input type="text" defaultValue={user?.fullName} className="input-field" readOnly />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">CARD NUMBER</label>
              <input type="text" placeholder="4242 4242 4242 4242" className="input-field" readOnly defaultValue="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">EXPIRY</label>
                <input type="text" defaultValue="12/26" className="input-field" readOnly />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">CVV</label>
                <input type="text" defaultValue="123" className="input-field" readOnly />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-600/10 border border-brand-500/20 text-sm text-brand-300">
              🧪 <strong>Test Mode:</strong> Using mock payment token <code className="text-brand-200">tok_visa</code>. Use <code>tok_fail</code> to simulate failure.
            </div>
            <input type="hidden" value={paymentToken} />

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-4">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : `Place Order · $${getTotalPrice().toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Review */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-white mb-6">Order Review</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={`${API.defaults.baseURL}/product/${item.id}/image`} alt={item.name} className="w-12 h-12 rounded-lg bg-surface-light object-contain p-1" onError={e => e.target.src = "/placeholder.png"} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <span className="text-white font-semibold text-sm">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-4 pt-4">
            <div className="flex justify-between font-bold text-white text-lg">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
