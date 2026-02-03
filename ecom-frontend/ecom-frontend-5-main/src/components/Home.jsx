import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <img src={unplugged} alt="Error" style={{ width: "150px", marginBottom: "1rem" }} />
        <h2 style={{ color: "var(--text-primary)" }}>Something went wrong...</h2>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{
        marginTop: "0",
        backgroundColor: "var(--background-color)",
        padding: "4rem 0",
        textAlign: "center",
        borderBottom: "1px solid var(--border-color)"
      }}>
        <div className="container-custom">
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to the Store</h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
            Discover the latest in technology and lifestyle. Premium quality, best prices.
          </p>
          <a href="#products-grid" className="btn btn-primary" style={{
            backgroundColor: "var(--secondary-color)",
            borderColor: "var(--secondary-color)",
            padding: "0.75rem 1.5rem",
            fontSize: "1.1rem",
            borderRadius: "50px"
          }}>
            Shop Now
          </a>
        </div>
      </section>

      {/* Products Grid */}
      <div id="products-grid" className="container-custom section-padding">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h2 style={{ color: "var(--text-secondary)" }}>No Products Available</h2>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}>
            {filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, imageUrl } = product;
              return (
                <div
                  key={id}
                  className="card"
                  style={{
                    border: "none",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--surface-color)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    textDecoration: "none",
                    opacity: productAvailable ? 1 : 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                >
                  <Link to={`/product/${id}`} style={{ flexGrow: 1, textDecoration: "none", color: "inherit", display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      height: "220px",
                      overflow: "hidden",
                      backgroundColor: "#f1f5f9",
                      position: 'relative'
                    }}>
                      <img
                        src={imageUrl}
                        alt={name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain", /* improved from cover to contain for full product visibility */
                          padding: "1rem",
                          mixBlendMode: "multiply" /* helps with white backgrounds */
                        }}
                      />
                      {!productAvailable && (
                        <div style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          OUT OF STOCK
                        </div>
                      )}
                    </div>

                    <div className="card-body" style={{
                      padding: "1.5rem",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left" /* Align left for modern look */
                    }}>
                      <div style={{ marginBottom: "auto" }}>
                        <p style={{
                          fontSize: "0.85rem",
                          color: "var(--secondary-color)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "0.25rem"
                        }}>
                          {brand}
                        </p>
                        <h5 style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                          color: "var(--primary-color)"
                        }}>
                          {name}
                        </h5>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "1rem"
                      }}>
                        <span style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "var(--text-primary)"
                        }}>
                          ${price}
                        </span>

                        <button
                          className="btn"
                          style={{
                            backgroundColor: productAvailable ? "var(--primary-color)" : "#cbd5e1",
                            color: "white",
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            transition: "background-color 0.2s"
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          disabled={!productAvailable}
                          title="Add to Cart"
                        >
                          <i className="bi bi-cart-plus-fill"></i>
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
