import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProductPage from './components/ProductPage';
import CategoryPage from './components/CategoryPage';
import CartPage from './components/CartPage'; // Import CartPage
import SliderManagementPage from './components/SliderManagementPage';
import UserManagementPage from "./components/UserManagementPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import { useCart } from './context/CartContext'; // Import useCart
import './theme.css';

const Navbar: React.FC<{ isAuthenticated: boolean, setIsAuthenticated: (isAuth: boolean) => void }> = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { cartItems } = useCart();
    const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const navStyle: React.CSSProperties = {
        padding: '1rem 2rem',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const navLinksContainerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    };

    const linkStyle: React.CSSProperties = {
        textDecoration: 'none',
        color: 'var(--color-text)',
        margin: '0 1rem',
        fontWeight: 500,
        position: 'relative'
    };

    const dropdownContainerStyle: React.CSSProperties = {
        position: 'relative',
        display: 'inline-block'
    };

    const dropdownContentStyle: React.CSSProperties = {
        display: isDropdownOpen ? 'block' : 'none',
        position: 'absolute',
        backgroundColor: 'var(--color-surface)',
        minWidth: '160px',
        boxShadow: 'var(--box-shadow)',
        zIndex: 1,
        borderRadius: 'var(--border-radius)',
        padding: '0.5rem 0'
    };

    const dropdownLinkStyle: React.CSSProperties = {
        color: 'var(--color-text)',
        padding: '12px 16px',
        textDecoration: 'none',
        display: 'block'
    };

    const cartBadgeStyle: React.CSSProperties = {
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-text-on-accent)',
        borderRadius: '50%',
        padding: '0.1rem 0.5rem',
        fontSize: '0.8rem',
        marginLeft: '0.5rem',
        fontWeight: 'bold'
    };

    return (
        <nav style={navStyle}>
            <div style={navLinksContainerStyle}>
                <Link to="/" style={linkStyle}>Strona Główna</Link>
                <div style={dropdownContainerStyle} onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                    <button style={{...linkStyle, background: 'none', border: 'none', cursor: 'pointer'}}>Produkty</button>
                    <div style={dropdownContentStyle}>
                        <Link to="/category/Szachownice" style={dropdownLinkStyle}>Szachownice</Link>
                        <Link to="/category/Figury" style={dropdownLinkStyle}>Figury</Link>
                        <Link to="/category/Zegary" style={dropdownLinkStyle}>Zegary</Link>
                        <Link to="/category/Książki" style={dropdownLinkStyle}>Książki</Link>
                        <Link to="/category/Zestawy" style={dropdownLinkStyle}>Zestawy</Link>
                    </div>
                </div>
            </div>
            <div>
                {isAuthenticated ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/dashboard" style={linkStyle}>
                            Panel
                            {totalItemsInCart > 0 && <span style={cartBadgeStyle}>{totalItemsInCart}</span>}
                        </Link>
                        <button onClick={handleLogout} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1rem' }}>
                            Wyloguj
                        </button>
                    </div>
                ) : (
                    <Link to="/login" style={linkStyle}>Login</Link>
                )}
            </div>
        </nav>
    );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route 
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route 
          path="/admin/slider" 
          element={
            <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
              <SliderManagementPage />
            </ProtectedRoute>
          }
        />
          <Route
              path="/admin/users"
              element={
                  <ProtectedRoute roles={['ROLE_ADMIN']}>
                      <UserManagementPage />
                  </ProtectedRoute>
              }
          />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;