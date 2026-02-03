import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <nav className="navbar navbar-expand-lg">
        <div className="container-custom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0.75rem 1rem'
        }}>
          {/* Brand */}
          <a className="navbar-brand" href="/" style={{
            fontFamily: 'var(--font-family-serif)',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: 'var(--primary-color)',
            textDecoration: 'none'
          }}>
            Store
          </a>

          {/* Toggle Button for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ border: 'none', color: 'var(--text-primary)' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links & Search */}
          <div className="collapse navbar-collapse" id="navbarContent" style={{ flexGrow: 1 }}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: '2rem', gap: '1rem' }}>
              <li className="nav-item">
                <a className="nav-link" href="/" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/add_product" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Add Product</a>
              </li>

              {/* Categories Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                >
                  Categories
                </a>
                <ul className="dropdown-menu" style={{
                  backgroundColor: 'var(--surface-color)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        onClick={() => onSelectCategory(category)}
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            {/* Right Side: Search, Theme, Cart */}
            <div className="d-flex align-items-center gap-3">
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    minWidth: '250px'
                  }}
                />
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <ul className="list-group" style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item" style={{
                          backgroundColor: 'transparent',
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer'
                        }}>
                          <a href={`/product/${result.id}`} style={{
                            textDecoration: 'none',
                            color: 'var(--text-primary)',
                            display: 'block'
                          }}>
                            {result.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <li className="list-group-item" style={{ color: 'var(--text-secondary)' }}>No results found</li>
                      )
                    )}
                  </ul>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              {/* Cart */}
              <a href="/cart" style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="bi bi-cart"></i>
              </a>

            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
