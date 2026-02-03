import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import API from "../axios";
import CheckoutPopup from "./CheckoutPopup";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]); // This logic seems flawed in original (array of blobs?), keeping for compatibility
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await API.get("/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await API.get(
                `/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await convertUrlToFile(response.data, response.data.imageName);
              setCartImage(prev => [...prev, imageFile]);

              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) {
      fetchImagesAndUpdateCart();
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const convertUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          alert("Cannot add more than available stock");
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };


  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    const newCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;

        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };

        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage[0]); // Using index 0 is risky but matches implied original logic/issue
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await API.put(`/product/${item.id}`, cartProduct, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
      alert("Checkout successful!");
    } catch (error) {
      console.log("error during checkout", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="container-custom section-padding" style={{ maxWidth: "1000px" }}>
      <h2 style={{ marginBottom: "2rem", color: "var(--primary-color)", fontWeight: 800 }}>Shopping Bag</h2>

      {cartItems.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "6rem 2rem",
          backgroundColor: "var(--surface-color)",
          borderRadius: "var(--radius-lg)",
          border: '1px dashed var(--border-color)'
        }}>
          <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'block' }}></i>
          <h4 style={{ color: "var(--text-secondary)" }}>Your cart is empty</h4>
          <a href="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>Start Shopping</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>

          {/* Cart Items List */}
          <div style={{
            backgroundColor: "var(--surface-color)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)",
            overflow: 'hidden'
          }}>
            {cartItems.map((item, index) => (
              <div key={item.id} style={{
                display: "flex",
                alignItems: "center",
                padding: "1.5rem",
                borderBottom: index !== cartItems.length - 1 ? "1px solid var(--border-color)" : "none",
                gap: "1.5rem"
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      mixBlendMode: 'multiply'
                    }}
                  />
                </div>

                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--secondary-color)", textTransform: "uppercase", fontWeight: 700, letterSpacing: '0.5px' }}>
                    {item.brand}
                  </div>
                  <h5 style={{ margin: "0.25rem 0", color: "var(--text-primary)", fontSize: '1.1rem' }}>
                    {item.name}
                  </h5>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    ${item.price} each
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '1rem' }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    border: '1px solid var(--border-color)',
                    borderRadius: '50px',
                    padding: '0.25rem'
                  }}>
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="btn"
                      style={{
                        width: "28px",
                        height: "28px",
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span style={{ width: "24px", textAlign: "center", fontWeight: "600", fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="btn"
                      style={{
                        width: "28px",
                        height: "28px",
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <i className="bi bi-plus-lg" style={{ fontSize: '0.8rem' }}></i>
                    </button>
                  </div>

                  <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                    ${item.price * item.quantity}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="btn"
                  style={{ color: "var(--text-secondary)", padding: '0.5rem', alignSelf: 'flex-start' }}
                  title="Remove item"
                  onMouseEnter={(e) => e.target.style.color = 'var(--error-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div style={{
            position: 'sticky',
            top: '100px'
          }}>
            <div style={{
              backgroundColor: "var(--surface-color)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
              padding: "2rem"
            }}>
              <h4 style={{ marginBottom: "1.5rem", fontSize: '1.25rem' }}>Order Summary</h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-color)' }}>
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
                style={{ width: '100%', padding: '1rem' }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      )}

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
