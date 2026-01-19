import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import api from "../../../../utils/api";
import { ROUTERS } from "../../../../utils/router";
import { useAuth } from "../../../../context/AuthContext";
import { useCart } from "../../../../context/CartContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenuData(res.data);
      } catch (err) {
        console.error("Lỗi tải menu:", err);
      }
    };
    fetchMenu();
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setProductsOpen(false);
    setInstructionsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate(`/${ROUTERS.USER.LOGIN}`);
    closeMenu(); // Tự động đóng menu
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      closeMenu(); // Tự động đóng menu
    }
  };

  return (
    <header className="header">
      <div className="top-row">
        <ul className="social-links desktop-only">
          {["facebook", "twitter", "youtube", "pinterest"].map((icon, i) => (
            <li key={i}>
              <a href="#" onClick={closeMenu}>
                <i className={`fab fa-${icon}`}></i>
              </a>
            </li>
          ))}
        </ul>

        <div className="logo">
          <Link to={`/${ROUTERS.USER.HOME}`} onClick={closeMenu}>
            <img src="/logo.png" alt="Company Logo" />
          </Link>
        </div>

        <ul className="auth-links desktop-only">
          {/* 🔔 ORDERS – HIỂN THỊ CHO CẢ USER & ADMIN */}
          {user && (
            <li>
              <Link to={`/${ROUTERS.USER.MY_ORDERS}`} onClick={closeMenu}>
                <i className="fa fa-box"></i> Orders
              </Link>
            </li>
          )}
          {!user ? (
            <>
              <li>
                <Link to={`/${ROUTERS.USER.LOGIN}`} onClick={closeMenu}>
                  <i className="fa fa-user"></i> Login
                </Link>
              </li>
              <li>
                <Link to={`/${ROUTERS.USER.SHOPPINGCART}`} onClick={closeMenu}>
                  <i className="fa fa-shopping-cart"></i>
                  {cartCount > 0 && (
                    <span
                      className="position-absolute translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${ROUTERS.USER.REGISTER}`}
                  className="highlight"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <li>
                  <Link
                    to={`/${ROUTERS.ADMIN.DASHBOARD}`}
                    className="highlight-admin"
                  >
                    <i className="fa fa-cog"></i> Admin
                  </Link>
                </li>
              )}
              <li>
                <Link to={`/${ROUTERS.USER.PROFILEUSER}`} onClick={closeMenu}>
                  <i className="fa fa-user"></i> Hi,{" "}
                  {user.name || user.username}
                </Link>
              </li>
              <li>
                <Link onClick={closeMenu} to={`/${ROUTERS.USER.SHOPPINGCART}`}>
                  <i className="fa fa-shopping-cart"></i>
                  {cartCount > 0 && (
                    <span
                      className="position-absolute translate-middle badge rounded-pill bg-danger"
                      style={{
                        fontSize: "0.7rem",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link className="highlight" onClick={handleLogout}>
                  <i className="fa fa-sign-out"></i> Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Đã xóa navbar-expand-lg */}
      <nav className="navbar navbar-dark bg-dark mt-2">
        {/* Đã thay .collapse.navbar-collapse bằng .navbar-content-wrapper */}
        <div className="navbar-content-wrapper">
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

            <li>
              <Link to={`/${ROUTERS.USER.HOME}`} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to={`/${ROUTERS.USER.PROFILE}`} onClick={closeMenu}>
                About
              </Link>
            </li>

            <li className={`dropdown ${productsOpen ? "open" : ""}`}>
              <div className="product-menu-toggle">
                <Link to={`/${ROUTERS.USER.PRODUCTS}`} onClick={closeMenu}>
                  Products
                </Link>
                <span
                  className="dropdown-arrow"
                  onClick={() => setProductsOpen(!productsOpen)}
                >
                  ▾
                </span>
              </div>

              <ul className={`dropdown-menu ${productsOpen ? "open" : ""}`}>
                {menuData.map((category) => (
                  <li key={category.id}>
                    <Link to={category.path} onClick={closeMenu}>
                      {category.name}
                    </Link>
                    {category.subcategories?.length > 0 && (
                      <ul className="submenu">
                        {category.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <Link to={sub.path} onClick={closeMenu}>
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link to={`/${ROUTERS.USER.NEWS}`} onClick={closeMenu}>
                News
              </Link>
            </li>
            <li className={`dropdown ${instructionsOpen ? "open" : ""}`}>
              <span onClick={() => setInstructionsOpen(!instructionsOpen)}>
                Instructions ▾
              </span>
              <ul className={`dropdown-menu ${instructionsOpen ? "open" : ""}`}>
                <li>
                  <Link to={`/${ROUTERS.USER.PAYMENT}`} onClick={closeMenu}>
                    Payment instructions
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to={`/${ROUTERS.USER.CONTACT}`} onClick={closeMenu}>
                Contact
              </Link>
            </li>

            {/* --- MỤC DÀNH RIÊNG CHO DI ĐỘNG --- */}

            <li className="mobile-only mobile-search-form">
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-outline-light" type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </form>
            </li>
            {user && (
              <li className="mobile-only">
                <Link to={`/${ROUTERS.USER.MY_ORDERS}`} onClick={closeMenu}>
                  <i className="fa fa-box"></i> My Orders
                </Link>
              </li>
            )}

            {!user ? (
              <>
                <li className="mobile-only">
                  <Link to={`/${ROUTERS.USER.LOGIN}`} onClick={closeMenu}>
                    <i className="fa fa-user"></i> Login
                  </Link>
                </li>
                <li className="mobile-only">
                  <Link
                    to={`/${ROUTERS.USER.REGISTER}`}
                    className="highlight"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user.role === "admin" && (
                  <li className="mobile-only">
                    <Link
                      to={`/${ROUTERS.ADMIN.DASHBOARD}`}
                      className="highlight-admin"
                      onClick={closeMenu}
                    >
                      <i className="fa fa-cog"></i> Admin
                    </Link>
                  </li>
                )}
                <li className="mobile-only">
                  <Link to={`/${ROUTERS.USER.PROFILEUSER}`} onClick={closeMenu}>
                    <i className="fa fa-user"></i> Hi,{" "}
                    {user.name || user.username}
                  </Link>
                </li>
                <li className="mobile-only">
                  <Link className="highlight" onClick={handleLogout}>
                    <i className="fa fa-sign-out"></i> Logout
                  </Link>
                </li>
              </>
            )}

            <li className="mobile-only">
              <Link to={`/${ROUTERS.USER.SHOPPINGCART}`} onClick={closeMenu}>
                <i className="fa fa-shopping-cart"></i> Shopping cart
                {cartCount > 0 && (
                  <span className="badge rounded-pill bg-danger ms-2">{cartCount}</span>
                )}
              </Link>
            </li>

            <li className="mobile-only">
              <div className="social-links">
                {["facebook", "twitter", "youtube", "pinterest"].map(
                  (icon, i) => (
                    <a key={i} href="#" onClick={closeMenu}>
                      <i className={`fab fa-${icon}`}></i>
                    </a>
                  )
                )}
              </div>
            </li>
          </ul>

          {/* Thanh tìm kiếm DÀNH CHO DESKTOP */}
          <form className="d-flex pe-3 desktop-only" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>

        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </header >
  );
};

export default memo(Header);