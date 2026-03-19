import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiPackage, FiAlertTriangle } from "react-icons/fi";
import API from "../axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    API.get("/products").then(res => setProducts(res.data)).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      await API.delete(`/product/${id}`);
      toast.success("Product deleted");
      setProducts(p => p.filter(x => x.id !== id));
    } catch { toast.error("Failed to delete"); }
    setDeleting(null);
  };

  return (
    <div className="page-container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title flex items-center gap-3">
          <FiPackage className="text-brand-400" /> Admin Dashboard
        </h1>
        <Link to="/add-product" className="btn-primary">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Products", value: products.length, color: "text-brand-400" },
          { label: "Available", value: products.filter(p => p.productAvailable).length, color: "text-green-400" },
          { label: "Out of Stock", value: products.filter(p => !p.productAvailable).length, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-semibold text-white">All Products</h2>
        </div>
        {loading ? (
          <div className="space-y-3 p-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-white/5">
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Brand</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={`${API.defaults.baseURL}/product/${p.id}/image`} alt={p.name} className="w-10 h-10 rounded-lg object-contain bg-surface-light" onError={e=>e.target.src="/placeholder.png"} />
                        <span className="font-medium text-white line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.brand}</td>
                    <td className="px-4 py-3 text-gray-400">{p.category || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-white">${parseFloat(p.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.productAvailable ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {p.productAvailable ? "Available" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-blue-400 transition-colors" title="Edit">
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === p.id ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <FiTrash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
