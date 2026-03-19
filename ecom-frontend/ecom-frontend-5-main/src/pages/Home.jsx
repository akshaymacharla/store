import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiTrendingUp, FiShield } from "react-icons/fi";

const features = [
  { icon: FiShoppingBag, title: "Curated Products", desc: "Handpicked selection of premium items across every category." },
  { icon: FiTrendingUp, title: "Best Prices", desc: "Competitive pricing with regular deals and offers." },
  { icon: FiShield, title: "Secure Checkout", desc: "Your payment and data are always protected." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="page-container py-28 sm:py-36 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="badge bg-brand-600/20 text-brand-300 border border-brand-500/20 mb-6 inline-flex">
              ✨ The Future of Shopping
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-tight mb-6">
              Shop Smarter,{" "}
              <span className="bg-gradient-to-r from-brand-400 to-accent bg-clip-text text-transparent">
                Live Better
              </span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
              Discover thousands of premium products with blazing-fast search, seamless checkout, and real-time order tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-primary text-base px-8 py-3.5">
                Browse Collection <FiArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn-ghost text-base px-8 py-3.5">
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="page-container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="section-title mb-3">Why ShopNova?</h2>
          <p className="text-gray-400">Built for speed, security, and an exceptional shopping experience.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card p-7 hover:border-brand-500/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4 group-hover:bg-brand-600/30 transition-colors">
                <f.icon className="text-brand-400" size={22} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="page-container py-20">
        <div className="card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-accent/5 pointer-events-none" />
          <h2 className="section-title mb-4">Ready to start shopping?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Join thousands of happy customers discovering amazing products every day.</p>
          <Link to="/shop" className="btn-primary text-base px-10 py-3.5">
            Shop Now <FiArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
