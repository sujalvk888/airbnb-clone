// client/src/pages/MyProperties.jsx

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Home, Star, DollarSign, CalendarCheck } from 'lucide-react';

export default function MyProperties() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProperties = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/my-listings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch your properties.');
        
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-brand animate-spin" />
      </div>
    );
  }

  // Calculate High-Level Metrics
  const totalGlobalEarnings = properties.reduce((sum, prop) => sum + prop.totalEarnings, 0);
  const totalGlobalBookings = properties.reduce((sum, prop) => sum + prop.totalBookings, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Hosting Dashboard</h1>
          <p className="text-gray-500">Manage your listings and view your performance.</p>
        </div>
        <Link to="/become-a-host" className="bg-brand text-white font-bold px-6 py-3 rounded-lg hover:bg-rose-600 transition text-center">
          + Create New Listing
        </Link>
      </div>
      
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8">{error}</div>}

      {/* Overview Metrics Cards */}
      {properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Home className="h-6 w-6"/></div>
            <div><p className="text-sm text-gray-500 font-medium">Active Listings</p><p className="text-2xl font-bold text-gray-900">{properties.length}</p></div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><DollarSign className="h-6 w-6"/></div>
            <div><p className="text-sm text-gray-500 font-medium">Total Earnings</p><p className="text-2xl font-bold text-gray-900">${totalGlobalEarnings.toFixed(2)}</p></div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><CalendarCheck className="h-6 w-6"/></div>
            <div><p className="text-sm text-gray-500 font-medium">Total Bookings</p><p className="text-2xl font-bold text-gray-900">{totalGlobalBookings}</p></div>
          </div>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You don't have any listings yet.</h2>
          <p className="text-gray-500 mb-6">It's time to open your doors to the world.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map(property => (
            <Link key={property.id} to={`/listings/${property.id}`} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                <img src={property.coverImage} alt={property.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                  <Star className="h-3 w-3 fill-gray-900 text-gray-900" />
                  {property.avgRating || 'New'}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{property.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1">{property.location}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <div className="flex flex-col text-gray-700">
                    <span className="font-bold text-gray-900">{property.totalBookings}</span>
                    <span className="text-xs text-gray-500">Bookings</span>
                  </div>
                  <div className="flex flex-col text-right text-green-600">
                    <span className="font-bold text-gray-900">${property.totalEarnings.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">Earned</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}