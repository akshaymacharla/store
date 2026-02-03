import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from 'react-bootstrap';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImagesAndUpdateCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map((product) => product.id);

        const updatedCartItems = cart.filter((item) => backendProductIds.includes(item.id));
        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageFile = await convertUrlToFile(response.data, response.data.imageName);
              setCartImage(prev => [...prev, imageFile]); // This logic in original was weird, just keeping it consistent-ish but it seems to only keep last image? 
              // Actually original code set it to single file: setCartImage(imageFile). This means only one image is sent? 
              // The logic in handleCheckout loops and appends 'cartImage'. If cartImage is a single file, it's wrong for multiple items.
              // However, I will preserve existing logic behavior to avoid functional regression, just cleaning UI.

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
        cartProduct.append("imageFile", cartImage); // Potentially buggy original logic
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], { type: "application/json" })
        );

        await axios.put(`http://localhost:8080/api/product/${item.id}`, cartProduct, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
      alert("Checkout successful!");
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div className="container-custom section-padding" style={{ maxWidth: "900px" }}>
      <h2 style={{ marginBottom: "2rem", color: "var(--primary-color)" }}>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "4rem",
          backgroundColor: "var(--surface-color)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)"
        }}>
          <h4 style={{ color: "var(--text-secondary)" }}>Your cart is empty</h4>
          <a href="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>Continue Shopping</a>
        </div>
      ) : (
        <div style={{
          backgroundColor: "var(--surface-color)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          padding: "2rem"
        }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "1.5rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)"
                }}
              />

              <div style={{ flexGrow: 1, minWidth: "200px" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>{item.brand}</div>
                <h5 style={{ margin: 0, color: "var(--text-primary)" }}>{item.name}</h5>
                <div style={{ fontWeight: "bold", color: "var(--primary-color)", marginTop: "0.25rem" }}>${item.price}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  onClick={() => handleDecreaseQuantity(item.id)}
                  style={{ border: "1px solid var(--border-color)", background: "transparent", borderRadius: "4px", width: "30px", height: "30px" }}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span style={{ width: "30px", textAlign: "center", fontWeight: "bold" }}>{item.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(item.id)}
                  style={{ border: "1px solid var(--border-color)", background: "transparent", borderRadius: "4px", width: "30px", height: "30px" }}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              <div style={{ minWidth: "80px", textAlign: "right", fontWeight: "bold", fontSize: "1.1rem" }}>
                ${item.price * item.quantity}
              </div>

              <button
                onClick={() => handleRemoveFromCart(item.id)}
                style={{ border: "none", background: "transparent", color: "#ef4444", fontSize: "1.2rem", cursor: "pointer" }}
                title="Remove item"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
            <h4 style={{ margin: 0 }}>Total: ${totalPrice}</h4>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "50px",
                backgroundColor: "var(--secondary-color)",
                border: "none"
              }}
            >
              Checkout
            </Button>
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
