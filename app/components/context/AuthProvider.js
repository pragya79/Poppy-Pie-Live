'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth';

// Create the auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize with null states
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize role from localStorage (safely for SSR)
    const [role, setRole] = useState('user');
    const router = useRouter();

    // Handle checking auth status - made into a useCallback to avoid recreating on each render
    const checkAuthStatus = useCallback(async () => {
        if (typeof window === 'undefined') return; // Safe guard for SSR

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            // Call your backend API to validate the token
            const response = await axios.get(`${API_URL}/check-auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);

                // Also update role from localStorage to keep in sync
                const storedRole = localStorage.getItem('role');
                if (storedRole && ['user', 'admin'].includes(storedRole)) {
                    setRole(storedRole);
                }
            } else {
                console.log("Token validation failed, clearing auth state");
                handleLogout(false); // Silent logout (no redirect)
            }
        } catch (err) {
            console.error("Auth check error:", err);
            // Only clear if it's an auth error, not a network error
            if (err.response?.status === 401) {
                handleLogout(false); // Silent logout (no redirect)
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize auth state on page load
    useEffect(() => {
        // Get role from localStorage first
        if (typeof window !== 'undefined') {
            const storedRole = localStorage.getItem('role');
            if (storedRole && ['user', 'admin'].includes(storedRole)) {
                setRole(storedRole);
            }

            // Then check authentication status
            checkAuthStatus();
        }
    }, [checkAuthStatus]);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError('');

        try {
            if (!email || !password) {
                setError('Email and password are required');
                setLoading(false);
                return { error: 'Email and password are required' };
            }

            console.log(`Attempting login with email: ${email}`);

            // Single login endpoint that returns user with role
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            console.log('Login response:', response.data);

            // Handle successful login
            if (response.data.success && response.data.token) {
                // Extract role from response
                const userRole = response.data.user?.role || 'user';

                // Validate role is one of our accepted roles
                if (!['user', 'admin'].includes(userRole)) {
                    console.error('Invalid role received:', userRole);
                    setError('Invalid user role');
                    return { error: 'Invalid user role' };
                }

                // Store token and user role in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', userRole);

                console.log('Token stored in localStorage:', response.data.token.substring(0, 10) + '...');
                console.log('Role:', userRole);

                // Set user state
                setUser(response.data.user);
                setRole(userRole);
                setIsAuthenticated(true);

                // Return success with URL for redirection
                return {
                    success: true,
                    url: `/${userRole}/dashboard`
                };
            } else {
                console.error('Login response missing token or success:', response.data);
                setError(response.data.message || 'Login failed - no token received');
                return { error: response.data.message || 'Login failed - no token received' };
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const handleLogout = async (shouldRedirect = true) => {
        try {
            // Call logout API endpoint if needed
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_URL}/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).catch(err => console.log('Logout API error, continuing anyway'));
            }
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            // Clear local state and storage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            }

            setUser(null);
            setIsAuthenticated(false);
            setRole('user');

            // Only redirect if needed (not during silent auth checks)
            if (shouldRedirect) {
                router.push('/login');
            }
        }
    };

    // Get authenticated API instance with token
    const getAuthenticatedApi = () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        // Add response interceptor to handle token expiration
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid, logout
                    handleLogout();
                }
                return Promise.reject(error);
            }
        );

        return api;
    };

    // Check if user has admin role
    const isAdmin = () => role === 'admin';

    // Context value
    const value = {
        user,
        loading,
        error,
        role,
        isAdmin,
        login,
        logout: handleLogout,
        checkAuthStatus,
        isAuthenticated,
        getAuthenticatedApi
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};