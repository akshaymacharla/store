import React, { useState } from "react";
import API from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    API.post("/product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        alert("Product added successfully");
        setProduct({
          name: "",
          brand: "",
          description: "",
          price: "",
          category: "",
          stockQuantity: "",
          releaseDate: "",
          productAvailable: false,
        });
        setImage(null);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };

  return (
    <div className="container-custom section-padding">
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "var(--surface-color)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        padding: "3rem"
      }}>
        <h2 style={{ marginBottom: "2rem", color: "var(--primary-color)", textAlign: "center" }}>Add New Product</h2>

        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Product Name</label>
              <input
                type="text"
                className="form-control-custom" // Using our custom class from index.css
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Brand</label>
              <input
                type="text"
                className="form-control-custom"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
            <textarea
              className="form-control-custom"
              name="description"
              rows="4"
              value={product.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Price ($)</label>
              <input
                type="number"
                className="form-control-custom"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Category</label>
              <select
                className="form-control-custom"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Laptop">Laptop</option>
                <option value="Headphone">Headphone</option>
                <option value="Mobile">Mobile</option>
                <option value="Electronics">Electronics</option>
                <option value="Toys">Toys</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Stock Quantity</label>
              <input
                type="number"
                className="form-control-custom"
                name="stockQuantity"
                value={product.stockQuantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Release Date</label>
              <input
                type="date"
                className="form-control-custom"
                name="releaseDate"
                value={product.releaseDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Product Image</label>
            <input
              type="file"
              className="form-control-custom"
              onChange={handleImageChange}
            />
          </div>

          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              name="productAvailable"
              id="gridCheck"
              checked={product.productAvailable}
              onChange={(e) =>
                setProduct({ ...product, productAvailable: e.target.checked })
              }
              style={{ accentColor: 'var(--secondary-color)' }}
            />
            <label className="form-check-label" htmlFor="gridCheck" style={{ color: 'var(--text-primary)' }}>
              Product available in stock
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-md)' }}>
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
