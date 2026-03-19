import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiCheck } from "react-icons/fi";
import API from "../axios";
import toast from "react-hot-toast";

const CATEGORIES = ["Electronics", "Clothing", "Home & Garden", "Books", "Sports", "Beauty", "Toys"];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", brand: "", description: "", price: "", stockQuantity: "", productAvailable: true, category: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { toast.error("Please select a product image"); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("product", new Blob([JSON.stringify(form)], { type: "application/json" }));
      formData.append("imageFile", imageFile);
      await API.post("/product", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Product added successfully!");
      navigate("/shop");
    } catch (err) {
      toast.error(err.response?.data || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-10 max-w-2xl">
      <h1 className="section-title mb-8">Add New Product</h1>
      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">PRODUCT NAME *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="iPhone 15 Pro" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">BRAND *</label>
              <input name="brand" value={form.brand} onChange={handleChange} required placeholder="Apple" className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">DESCRIPTION</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description..." className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">PRICE ($) *</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required placeholder="999.99" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1.5 block">STOCK *</label>
              <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required placeholder="50" className="input-field" />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">CATEGORY</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-light">
            <input type="checkbox" name="productAvailable" checked={form.productAvailable} onChange={handleChange} id="available" className="w-4 h-4 accent-brand-500" />
            <label htmlFor="available" className="text-sm text-gray-300 cursor-pointer">Product is available for purchase</label>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium mb-1.5 block">PRODUCT IMAGE *</label>
            <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/40 transition-colors cursor-pointer">
              <FiUpload size={24} className={imageFile ? "text-green-400" : "text-gray-400"} />
              <span className="text-sm text-gray-400">{imageFile ? <span className="text-green-400 flex items-center gap-1"><FiCheck size={14} /> {imageFile.name}</span> : "Click to upload image"}</span>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="hidden" />
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
