import { useState, useEffect } from 'react';
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
import CommentVerificationPage from "./components/CommentVerificationPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import AddProductPage from "./components/AddProductPage";
import { useCart } from './context/CartContext';
import './theme.css';
import { getPendingCommentsCount } from "./api/commentService";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub: string;
    roles: string[];
    iat: number;
    exp: number;
}

const Navbar: React.FC<{ isAuthenticated: boolean, setIsAuthenticated: (isAuth: boolean) => void }> = ({ isAuthenticated, setIsAuthenticated }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { cartItems } = useCart();
    const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const [pendingCommentsCount, setPendingCommentsCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isAuthenticated && token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                const userRoles = decodedToken.roles;
                if (userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR')) {
                    getPendingCommentsCount()
                        .then(setPendingCommentsCount)
                        .catch(err => console.error("Failed to fetch pending comments count", err));
                }
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, [isAuthenticated]);


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