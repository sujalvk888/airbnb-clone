// client/src/pages/MyTrips.jsx

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Calendar, MapPin, Users, CreditCard } from 'lucide-react';

export default function MyTrips() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTrips = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my-trips`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch your trips.');
        
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Trips</h1>
      
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8">{error}</div>}

      {trips.length === 0 ? (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No trips booked... yet!</h2>
          <p className="text-gray-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
          <Link to="/" className="inline-block border border-gray-900 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-50 transition">
            Start searching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => {
            const checkInDate = new Date(trip.checkIn).toLocaleDateString();
            const checkOutDate = new Date(trip.checkOut).toLocaleDateString();

            return (
              <div key={trip.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                <div className="h-48 w-full bg-gray-200">
                  <img src={trip.listing.coverImage} alt={trip.listing.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{trip.listing.location}</h3>
                    <p className="text-gray-500 text-sm line-clamp-1">{trip.listing.title}</p>
                  </div>
                  
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-brand" />
                      <span>{checkInDate} - {checkOutDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Users className="h-4 w-4 text-brand" />
                      <span>{trip.guestCount} {trip.guestCount === 1 ? 'guest' : 'guests'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                      <CreditCard className="h-4 w-4 text-brand" />
                      <span>Total: ${trip.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {trip.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}