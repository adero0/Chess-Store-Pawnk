import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Auth from './components/Auth';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProductPage from './components/ProductPage';
import CategoryPage from './components/CategoryPage';
import CartPage from './components/CartPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import SliderManagementPage from './components/SliderManagementPage';
import UserManagementPage from './components/UserManagementPage';
import CommentVerificationPage from './components/CommentVerificationPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import AddProductPage from './components/AddProductPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import { CartProvider, useCart } from './context/CartContext';
import { getPendingCommentsCount } from './api/commentService';
import { jwtDecode } from 'jwt-decode';
import './theme.css';

interface DecodedToken {
  sub: string;
  roles: string[];
  iat: number;
  exp: number;
}

const Navbar: React.FC<{ isAuthenticated: boolean; setIsAuthenticated: (isAuth: boolean) => void }> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cartItems } = useCart();
  const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [pendingCommentsCount, setPendingCommentsCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isAuthenticated && token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userRoles = decodedToken.roles;
        if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR')) {
          getPendingCommentsCount().then(setPendingCommentsCount).catch(console.error);
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, [isAuthenticated]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsDropdownOpen(false);
  }, [setIsAuthenticated]);

  const navStyle: React.CSSProperties = {
    padding: '1rem 2rem',
    backgroundColor: 'var(--card)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '2rem',
  };

  const navLinkStyle: React.CSSProperties = (isActive: boolean) => ({
    textDecoration: 'none',
    color: 'var(--foreground)',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)',
  });

  const cartBadgeStyle: React.CSSProperties = {
    backgroundColor: 'var(--destructive)',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.5rem',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    minWidth: '200px',
    zIndex: 1000,
  };

  const token = localStorage.getItem('token');
  let userRoles: string[] = [];
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      userRoles = decoded.roles;
    } catch {}
  }
  const isAdminOrMod = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

  return (
    <nav style={navStyle}>
      <Link to="/" style={navLinkStyle(location.pathname === '/')}>
        Sklep Szachowy
      </Link>
      <ul style={navLinksStyle}>
        <li>
          <Link to="/category/Zestawy" style={navLinkStyle(location.pathname.startsWith('/category/Zestawy'))}>
            Zestawy
          </Link>
        </li>
        <li>
          <Link to="/cart" style={navLinkStyle(location.pathname === '/cart')}>
            Koszyk
            {totalItemsInCart > 0 && <span style={cartBadgeStyle}>{totalItemsInCart}</span>}
          </Link>
        </li>
      </ul>
      <div style={{ position: 'relative' }}>
        {isAuthenticated ? (
          <>
            {isAdminOrMod && (
              <span style={{ marginRight: '1rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                Admin {pendingCommentsCount > 0 && `(${pendingCommentsCount})`}
              </span>
            )}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--foreground)',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
              }}
            >
              Dashboard
            </button>
            {isDropdownOpen && (
              <div style={dropdownStyle}>
                <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                  Dashboard
                </Link>
                {isAdminOrMod && (
                  <>
                    <Link to="/admin/add-product" onClick={() => setIsDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                      Dodaj Produkt
                    </Link>
                    <Link to="/admin/slider" onClick={() => setIsDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                      Slajder
                    </Link>
                    <Link to="/admin/comments" onClick={() => setIsDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                      Komentarze
                    </Link>
                  </>
                )}
                {userRoles.includes('ROLE_ADMIN') && (
                  <Link to="/admin/users" onClick={() => setIsDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                    Użytkownicy
                  </Link>
                )}
                <Link to="/orders" onClick={() => setIsDropdownOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                  Zamówienia
                </Link>
                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.75rem 1rem', color: 'var(--destructive)', cursor: 'pointer' }}>
                  Wyloguj
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" style={navLinkStyle(location.pathname === '/login')}>
            Zaloguj
          </Link>
        )}
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/slider"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
              <SliderManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/comments"
          element={
            <ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_MODERATOR']}>
              <CommentVerificationPage />
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
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
