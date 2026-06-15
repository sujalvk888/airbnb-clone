// client/src/pages/Wishlist.jsx

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';

export default function Wishlist() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}/wishlist`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to load wishlist');
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
      
      {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl mb-6">{error}</div>}

      {listings.length === 0 ? (
        <div className="py-12 border-t border-gray-200 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved homes</h2>
          <p className="text-gray-500 mb-6">As you search, tap the heart icon to save your favorite places here.</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 border border-gray-900 text-gray-900 rounded-lg font-bold hover:bg-gray-50 transition"
          >
            Start Exploring
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}