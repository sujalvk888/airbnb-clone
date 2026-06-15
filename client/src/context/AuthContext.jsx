// client/src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Validate token on initial load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // NEW: Centralized Wishlist Toggle
  const toggleWishlist = async (listingId) => {
    if (!user || !token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/wishlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listingId })
      });
      
      if (!response.ok) throw new Error('Failed to update wishlist');
      const data = await response.json();
      
      // Update state without needing to refresh the page
      setUser(prev => ({ ...prev, wishlistIds: data.wishlistIds }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};