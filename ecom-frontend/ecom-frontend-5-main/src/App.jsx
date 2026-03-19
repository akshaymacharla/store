import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import useAuthStore from "./store/useAuthStore";

// Lazy-loaded pages for code splitting
const Home      = lazy(() => import("./pages/Home"));
const Shop      = lazy(() => import("./pages/Shop"));
const Login     = lazy(() => import("./pages/Login"));
const Register  = lazy(() => import("./pages/Register"));
const Cart      = lazy(() => import("./pages/Cart"));
const Wishlist  = lazy(() => import("./pages/Wishlist"));
const Checkout  = lazy(() => import("./pages/Checkout"));
const Orders    = lazy(() => import("./pages/Orders"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#2a2a3e', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)' },
          duration: 3000,
        }}
      />
      <Navbar />
      <main className="min-h-screen pt-16">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/shop"      element={<Shop />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart"      element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/wishlist"  element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/checkout"  element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders"    element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/add-product" element={<ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>} />
            <Route path="/admin"     element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;
