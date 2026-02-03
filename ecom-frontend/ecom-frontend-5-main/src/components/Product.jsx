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
          `http://localhost:8080/api/product/${id}`
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
          `http://localhost:8080/api/product/${id}/image`,
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
        await axios.delete(`http://localhost:8080/api/product/${id}`);
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
        <h2 style={{ color: "var(--text-secondary)" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "4rem",
        alignItems: "start"
      }}>
        {/* Left Column: Image */}
        <div style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <img
            src={imageUrl}
            alt={product.imageName}
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              objectFit: "contain",
              borderRadius: "var(--radius-md)"
            }}
          />
        </div>

        {/* Right Column: Details */}
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{
              color: "var(--secondary-color)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontSize: "0.9rem"
            }}>
              {product.category}
            </span>
            <h1 style={{
              fontSize: "2.5rem",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
              color: "var(--primary-color)"
            }}>
              {product.name}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: "1.1rem" }}>
              ~ {product.brand}
            </p>
          </div>

          <p style={{
            lineHeight: "1.8",
            color: "var(--text-primary)",
            marginBottom: "2rem",
            fontSize: "1.05rem"
          }}>
            {product.description}
          </p>

          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "var(--primary-color)"
            }}>
              ${product.price}
            </span>
            <span style={{
              color: product.stockQuantity > 0 ? "green" : "red",
              fontWeight: 600,
              fontSize: "1rem"
            }}>
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            <button
              onClick={handlAddToCart}
              disabled={!product.productAvailable}
              style={{
                backgroundColor: product.productAvailable ? "var(--secondary-color)" : "#cbd5e1",
                color: "white",
                padding: "1rem 2.5rem",
                border: "none",
                borderRadius: "50px",
                fontSize: "1.1rem",
                fontWeight: 600,
                cursor: product.productAvailable ? "pointer" : "not-allowed",
                transition: "background-color 0.2s"
              }}
            >
              {product.productAvailable ? (
                <>
                  <i className="bi bi-cart-plus me-2"></i> Add to Cart
                </>
              ) : "Out of Stock"}
            </button>
          </div>

          <hr style={{ borderColor: "var(--border-color)", margin: "2rem 0" }} />

          {/* Admin Actions */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleEditClick}
              className="btn btn-outline-primary"
              style={{ borderRadius: "50px", padding: "0.5rem 1.5rem" }}
            >
              Update Product
            </button>
            <button
              onClick={deleteProduct}
              className="btn btn-outline-danger"
              style={{ borderRadius: "50px", padding: "0.5rem 1.5rem" }}
            >
              Delete Product
            </button>
          </div>

          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Listed on: {new Date(product.releaseDate).toLocaleDateString()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Product;