import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/product/${id}`);
        removeFromCart(id);
        alert("Product deleted successfully");
        refreshData();
        navigate("/");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "4rem",
        alignItems: "center",
        width: '100%'
      }}>
        {/* Left Column: Image */}
        <div style={{
          backgroundColor: "#fff",
          padding: "3rem",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: '1px solid var(--border-color)',
          aspectRatio: '1/1',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative bg circle */}
          <div style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, var(--background-color) 0%, transparent 70%)',
            zIndex: 0
          }}></div>
          <img
            src={imageUrl}
            alt={product.imageName}
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              zIndex: 1,
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))'
            }}
          />
        </div>

        {/* Right Column: Details */}
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: "var(--secondary-color)",
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontSize: "0.8rem",
              marginBottom: '1rem'
            }}>
              {product.category}
            </span>
            <h1 style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              marginBottom: "0.5rem",
              color: "var(--primary-color)",
              lineHeight: 1.1
            }}>
              {product.name}
            </h1>
            <p style={{
              color: "var(--text-secondary)",
              fontSize: "1.2rem",
              fontWeight: 500
            }}>
              by <span style={{ color: 'var(--text-primary)' }}>{product.brand}</span>
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
            <span style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "var(--primary-color)",
              letterSpacing: '-1px'
            }}>
              ${product.price}
            </span>
            <div style={{
              height: '30px',
              width: '1px',
              background: 'var(--border-color)'
            }}></div>
            <span style={{
              color: product.stockQuantity > 0 ? "var(--success-color)" : "var(--error-color)",
              fontWeight: 600,
              fontSize: "1rem",
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className={`bi ${product.stockQuantity > 0 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p style={{
            lineHeight: "1.8",
            color: "var(--text-secondary)",
            marginBottom: "3rem",
            fontSize: "1.05rem",
            maxWidth: '600px'
          }}>
            {product.description}
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            <button
              onClick={handlAddToCart}
              disabled={!product.productAvailable}
              className="btn btn-primary"
              style={{
                padding: "1rem 2.5rem",
                borderRadius: "50px",
                fontSize: "1.1rem",
                fontWeight: 600,
                opacity: product.productAvailable ? 1 : 0.6,
                transform: product.productAvailable ? 'none' : 'none',
                boxShadow: product.productAvailable ? 'var(--shadow-lg)' : 'none'
              }}
            >
              {product.productAvailable ? (
                <>
                  <i className="bi bi-bag-plus me-2"></i> Add to Cart
                </>
              ) : "Out of Stock"}
            </button>

            {/* Wishlist or other action placeholder */}
            <button className="btn" style={{
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)'
            }}>
              <i className="bi bi-heart"></i>
            </button>
          </div>

          <hr style={{ borderColor: "var(--border-color)", margin: "2rem 0", opacity: 0.5 }} />

          {/* Admin Actions */}
          <div style={{ display: "flex", gap: "1rem", opacity: 0.7 }}>
            <button
              onClick={handleEditClick}
              className="btn"
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
            >
              <i className="bi bi-pencil me-1"></i> Edit
            </button>
            <button
              onClick={deleteProduct}
              className="btn"
              style={{ fontSize: '0.9rem', color: 'var(--error-color)' }}
            >
              <i className="bi bi-trash me-1"></i> Delete
            </button>
          </div>

          <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Product Release: {new Date(product.releaseDate).toLocaleDateString()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Product;