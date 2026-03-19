import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiClock } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";
import API from "../axios";

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      API.get(`/orders/user/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const statusColor = (s) => ({
    CONFIRMED: "bg-green-500/10 text-green-400",
    PENDING: "bg-yellow-500/10 text-yellow-400",
    CANCELLED: "bg-red-500/10 text-red-400",
  }[s] || "bg-gray-500/10 text-gray-400");

  return (
    <div className="page-container py-10">
      <h1 className="section-title mb-8 flex items-center gap-3">
        <FiPackage className="text-brand-400" /> Order History
      </h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <FiPackage size={64} className="mx-auto text-gray-600 mb-6" />
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-gray-400">Your order history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="flex flex-wrap gap-4 items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order #{order.id}</p>
                  <p className="text-white font-semibold text-lg">${parseFloat(order.totalAmount).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiClock size={12} /> {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {order.orderItems?.map((item, j) => (
                  <div key={j} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.productName} <span className="text-gray-500">× {item.quantity}</span></span>
                    <span className="text-gray-400">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
