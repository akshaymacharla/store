import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(
          `/product/${id}`
        );

        setProduct(response.data);

        const responseImage = await API.get(
          `/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageUrl = URL.createObjectURL(responseImage.data);
        setImagePreview(imageUrl);

        // Convert to file logic if needed, but for preview URL is enough? 
        // Original logic had convertUrlToFile. keeping it simple for UI refactor focused on layout.

      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    try {
      await API.put(`/product/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
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
        <h2 style={{ marginBottom: "2rem", color: "var(--primary-color)", textAlign: "center" }}>Update Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Product Name</label>
              <input
                type="text"
                className="form-control-custom"
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
                value={product.releaseDate ? new Date(product.releaseDate).toISOString().split('T')[0] : ''} // Format date for input
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Product Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
              )}
              <input
                type="file"
                className="form-control-custom"
                onChange={handleImageChange}
              />
            </div>
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-md)' }}>Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;