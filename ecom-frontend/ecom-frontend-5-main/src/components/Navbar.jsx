import React, { useEffect, useState } from "react";
import API from "../axios";

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
        const response = await API.get(
          `/products/search?keyword=${value}`
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
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.3s ease'
    }}>
      {/* Dark mode overlay override for glass effect */}
      <style>{`
        body.dark-theme header {
          backgroundColor: rgba(15, 23, 42, 0.8) !important;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg">
        <div className="container-custom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '1rem'
        }}>
          {/* Brand */}
          <a className="navbar-brand" href="/" style={{
            fontFamily: 'var(--font-family-serif)',
            fontWeight: 800,
            fontSize: '1.75rem',
            color: 'var(--primary-color)',
            textDecoration: 'none',
            letterSpacing: '-1px'
          }}>
            Store<span style={{ color: 'var(--secondary-color)' }}>.</span>
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
            style={{ border: 'none', color: 'var(--text-primary)', padding: 0 }}
          >
            <span className="navbar-toggler-icon" style={{
              backgroundImage: theme === 'dark-theme' ? "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")" : undefined
            }}></span>
          </button>

          {/* Links & Search */}
          <div className="collapse navbar-collapse" id="navbarContent" style={{ flexGrow: 1 }}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: '2rem', gap: '1.5rem', alignItems: 'center' }}>
              <li className="nav-item">
                <a className="nav-link" href="/" style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/add_product" style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>Add Product</a>
              </li>

              {/* Categories Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}
                >
                  Categories
                </a>
                <ul className="dropdown-menu" style={{
                  backgroundColor: 'var(--surface-color)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-md)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem'
                }}>
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        onClick={() => onSelectCategory(category)}
                        style={{
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.5rem 1rem',
                          fontWeight: 500
                        }}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            {/* Right Side: Search, Theme, Cart */}
            <div className="d-flex align-items-center gap-4">
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none'
                }}>
                  <i className="bi bi-search"></i>
                </div>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  style={{
                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                    borderRadius: '50px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    minWidth: '280px',
                    fontSize: '0.9rem',
                    transition: 'box-shadow 0.2s'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                />

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <ul className="list-group" style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    width: '100%',
                    zIndex: 1000,
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '0.5rem'
                  }}>
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li key={result.id} className="list-group-item" style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          padding: '0',
                          marginBottom: '0.25rem'
                        }}>
                          <a href={`/product/${result.id}`} style={{
                            textDecoration: 'none',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            transition: 'background-color 0.2s'
                          }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {/* Small thumbnail if possible, else just text */}
                            <span style={{ fontWeight: 500 }}>{result.name}</span>
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <li className="list-group-item" style={{ color: 'var(--text-secondary)', border: 'none', textAlign: 'center', padding: '1rem' }}>No results found</li>
                      )
                    )}
                  </ul>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(15deg)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0)'}
              >
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-stars-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill" style={{ color: '#f59e0b' }}></i>
                )}
              </button>

              {/* Cart */}
              <a href="/cart" style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '1.35rem',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}>
                <i className="bi bi-bag"></i>
                {/* Optional Badge could go here */}
              </a>

            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
