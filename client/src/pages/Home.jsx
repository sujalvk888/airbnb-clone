// client/src/pages/Home.jsx

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchGuests, setSearchGuests] = useState('');
  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [searchCheckOut, setSearchCheckOut] = useState('');

  // Fetch function with an isReset flag to bypass current state during reset
  const fetchListings = async (e, isReset = false) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault(); 
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      
      if (!isReset) {
        if (searchLocation) params.append('location', searchLocation);
        if (searchGuests) params.append('guestCount', searchGuests);
        if (searchCheckIn) params.append('checkIn', searchCheckIn);
        if (searchCheckOut) params.append('checkOut', searchCheckOut);
      }
      
      const queryString = params.toString();
      const url = `${import.meta.env.VITE_API_URL}/api/listings${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load listings');
      
      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run once on initial page load
  useEffect(() => {
    fetchListings();
  }, []);

  // Listen for logo click events from the Navbar
  useEffect(() => {
    const handleReset = () => {
      setSearchLocation('');
      setSearchGuests('');
      setSearchCheckIn('');
      setSearchCheckOut('');
      fetchListings(null, true);
    };

    window.addEventListener('resetHomeSearch', handleReset);
    return () => window.removeEventListener('resetHomeSearch', handleReset);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Sub-Header: Advanced Visual Search Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 py-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-max">
          
          <div className="flex justify-center">
            <form 
              onSubmit={fetchListings}
              className="flex items-center border border-gray-200 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-white divide-x divide-gray-200 overflow-hidden"
            >
              {/* Where Section */}
              <div className="flex flex-col px-8 py-3 rounded-l-full focus-within:bg-gray-100 hover:bg-gray-100 transition cursor-pointer">
                <label className="text-xs font-bold text-gray-900 tracking-wide mb-1">Where</label>
                <input 
                  type="text" 
                  placeholder="Search destinations" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="text-sm font-light text-gray-600 bg-transparent outline-none w-40 sm:w-48 placeholder-gray-500"
                />
              </div>
              
              {/* When Section */}
              <div className="flex flex-col px-8 py-3 focus-within:bg-gray-100 hover:bg-gray-100 transition cursor-pointer">
                <label className="text-xs font-bold text-gray-900 tracking-wide mb-1">When</label>
                <div className="flex items-center bg-transparent gap-2">
                  <input 
                    type="date" 
                    min={today}
                    value={searchCheckIn}
                    onChange={(e) => setSearchCheckIn(e.target.value)}
                    className="text-sm font-light text-gray-600 bg-transparent outline-none w-[110px] cursor-pointer"
                    title="Check-in Date"
                  />
                  <span className="text-gray-300">-</span>
                  <input 
                    type="date" 
                    min={searchCheckIn || today}
                    value={searchCheckOut}
                    onChange={(e) => setSearchCheckOut(e.target.value)}
                    className="text-sm font-light text-gray-600 bg-transparent outline-none w-[110px] cursor-pointer"
                    title="Check-out Date"
                  />
                </div>
              </div>
              
              {/* Who Section */}
              <div className="flex items-center pl-8 pr-2 py-2 rounded-r-full focus-within:bg-gray-100 hover:bg-gray-100 transition cursor-pointer">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-900 tracking-wide mb-1">Who</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Add guests" 
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                    className="text-sm font-light text-gray-600 bg-transparent outline-none w-28 placeholder-gray-500"
                  />
                </div>
                {/* Large Red Search Button */}
                <button 
                  type="submit" 
                  className="bg-brand h-12 w-12 rounded-full text-white ml-4 hover:bg-rose-600 transition flex items-center justify-center shrink-0 shadow-sm"
                >
                  <Search className="h-5 w-5" strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-brand">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="text-gray-500 font-medium">Searching amazing places...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl font-medium">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No exact matches</h2>
            <p className="text-gray-500 mb-6">Try changing or removing some of your filters.</p>
            <button 
              onClick={(e) => {
                setSearchLocation('');
                setSearchGuests('');
                setSearchCheckIn('');
                setSearchCheckOut('');
                fetchListings(e, true);
              }}
              className="px-6 py-2 border border-gray-900 text-gray-900 rounded-lg font-bold hover:bg-gray-50 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}