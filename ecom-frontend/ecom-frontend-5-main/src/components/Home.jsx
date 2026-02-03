import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../axios";
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
              const response = await API.get(
                `/product/${product.id}/image`,
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
        <img src={unplugged} alt="Error" style={{ width: "150px", marginBottom: "2rem", opacity: 0.8 }} />
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700 }}>Something went wrong...</h2>
        <p style={{ color: "var(--text-secondary)" }}>Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, var(--surface-color) 0%, var(--background-color) 100%)",
        padding: "5rem 0 3rem 0",
        textAlign: "center",
        borderBottom: "1px solid var(--border-color)",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract background blobs could go here */}
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            marginBottom: "1.5rem",
            background: "linear-gradient(to right, var(--primary-color), var(--secondary-color))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block"
          }}>
            Welcome to the Store
          </h1>
          <p style={{
            fontSize: "1.25rem",
            color: "var(--text-secondary)",
            marginBottom: "2.5rem",
            maxWidth: "600px",
            margin: "0 auto 2.5rem auto",
            lineHeight: 1.6
          }}>
            Discover the latest in technology and lifestyle. <br />Premium quality products at the best prices.
          </p>
          <a href="#products-grid" className="btn btn-primary" style={{
            padding: "1rem 2.5rem",
            fontSize: "1.1rem",
            borderRadius: "50px",
            boxShadow: "0 10px 20px -5px rgba(59, 130, 246, 0.4)"
          }}>
            Shop Collection
          </a>
        </div>
      </section>

      {/* Products Grid */}
      <div id="products-grid" className="container-custom section-padding">

        <div style={{ marginBottom: "3rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '2rem' }}>
            {selectedCategory ? `${selectedCategory} Collection` : "Featured Products"}
          </h3>
          <span style={{ color: 'var(--text-secondary)' }}>
            {filteredProducts.length} Products
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 style={{ color: "var(--text-secondary)" }}>No Products Available</h4>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2.5rem",
          }}>
            {filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, imageUrl } = product;
              return (
                <div
                  key={id}
                  className="card card-hover"
                  style={{
                    border: "none",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--surface-color)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    textDecoration: "none",
                    boxShadow: "var(--shadow-md)",
                    position: 'relative'
                  }}
                >
                  <Link to={`/product/${id}`} style={{ flexGrow: 1, textDecoration: "none", color: "inherit", display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      height: "260px",
                      overflow: "hidden",
                      backgroundColor: "var(--background-color)",
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2rem'
                    }}>
                      <img
                        src={imageUrl}
                        alt={name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          mixBlendMode: "multiply",
                          transition: "transform 0.5s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                      />
                      {!productAvailable && (
                        <div style={{
                          position: 'absolute',
                          top: 15,
                          right: 15,
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backdropFilter: 'blur(4px)'
                        }}>
                          SOLD OUT
                        </div>
                      )}
                    </div>

                    <div className="card-body" style={{
                      padding: "1.5rem",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      borderTop: "1px solid var(--border-color)"
                    }}>
                      <div style={{ marginBottom: "auto" }}>
                        <p style={{
                          fontSize: "0.8rem",
                          color: "var(--secondary-color)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.5rem"
                        }}>
                          {brand}
                        </p>
                        <h5 style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                          color: "var(--text-primary)",
                          lineHeight: 1.4
                        }}>
                          {name}
                        </h5>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "1.25rem"
                      }}>
                        <span style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "var(--primary-color)"
                        }}>
                          ${price}
                        </span>

                        <button
                          className="btn"
                          style={{
                            backgroundColor: productAvailable ? "var(--primary-color)" : "var(--border-color)",
                            color: "white",
                            borderRadius: "50%",
                            width: "42px",
                            height: "42px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            transition: "all 0.2s ease"
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          disabled={!productAvailable}
                          title="Add to Cart"
                        >
                          <i className="bi bi-plus-lg" style={{ fontSize: '1.2rem' }}></i>
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
