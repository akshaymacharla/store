import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiHeart, FiShoppingCart, FiX } from "react-icons/fi";
import useProductStore from "../store/useProductStore";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import API from "../axios";

const CATEGORIES = ["Electronics", "Clothing", "Home & Garden", "Books", "Sports", "Beauty", "Toys"];

const SkeletonCard = () => (
  <div className="card p-0 overflow-hidden">
    <div className="skeleton h-52 rounded-none" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-5 w-full rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
    </div>
  </div>
);

export default function Shop() {
  const { products, loading, fetchProducts, searchProducts } = useProductStore();
  const addToCart = useCartStore((s) => s.addToCart);
  const { isAuthenticated, user } = useAuthStore();

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Debounce keyword input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Trigger search when debounced keyword or filters change
  useEffect(() => {
    const params = {
      keyword: debouncedKeyword || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    };
    const hasFilters = Object.values(params).some(Boolean);
    if (hasFilters) {
      searchProducts(params);
    } else {
      fetchProducts();
    }
  }, [debouncedKeyword, category, minPrice, maxPrice]);

  const clearFilters = () => {
    setKeyword(""); setCategory(""); setMinPrice(""); setMaxPrice("");
  };

  const hasFilters = keyword || category || minPrice || maxPrice;

  return (
    <div className="page-container py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="card p-5 space-y-6 sticky top-20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2"><FiFilter size={16} /> Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  <FiX size={12} /> Clear
                </button>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">SEARCH</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="input-field pl-9 text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">CATEGORY</label>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory("")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? "bg-brand-600/20 text-brand-300" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === c ? "bg-brand-600/20 text-brand-300" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">PRICE RANGE</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="input-field text-sm py-2" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input-field text-sm py-2" />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">{category || "All Products"}</h2>
            <span className="text-sm text-gray-400">{products.length} items</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400">Try different keywords or clear your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="card overflow-hidden hover:border-brand-500/30 transition-all duration-300 group flex flex-col"
                >
                  <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-surface-light">
                    <img
                      src={`${API.defaults.baseURL}/product/${product.id}/image`}
                      alt={product.name}
                      className="w-full h-52 object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = "/placeholder.png"; }}
                    />
                    {!product.productAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="badge bg-red-500/80 text-white text-sm px-3 py-1">Sold Out</span>
                      </div>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs text-brand-400 font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
                    <Link to={`/product/${product.id}`} className="font-semibold text-white hover:text-brand-300 transition-colors line-clamp-2 mb-3 flex-1">
                      {product.name}
                    </Link>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-white">${parseFloat(product.price).toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.productAvailable}
                        className="btn-primary py-2 px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiShoppingCart size={15} />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
