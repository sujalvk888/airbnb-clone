// client/src/pages/Home.jsx

import { useState, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react'; // Added X icon
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

  // Mobile UX State: Controls if the search bar is expanded on phones
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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
      // Auto-collapse the mobile search bar after searching
      setIsMobileSearchOpen(false); 
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

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
      
      {/* Sub-Header: Responsive Visual Search Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 py-3 md:py-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* --- 1. MOBILE COMPACT "PILL" (Visible ONLY on phones when closed) --- */}
          {!isMobileSearchOpen && (
            <div 
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden flex items-center gap-3 bg-white border border-gray-300 rounded-full shadow-[0_3px_10px_rgb(0,0,0,0.1)] p-2 cursor-pointer hover:shadow-md transition"
            >
              <div className="bg-gray-100 p-2.5 rounded-full text-gray-900">
                <Search className="h-5 w-5" strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-tight">Where to?</span>
                <span className="text-xs text-gray-500 truncate leading-tight mt-0.5">
                  {searchLocation || 'Anywhere'} • {searchCheckIn ? 'Dates set' : 'Any week'} • {searchGuests ? `${searchGuests} guests` : 'Add guests'}
                </span>
              </div>
            </div>
          )}

          {/* --- 2. FULL SEARCH FORM (Visible on Desktop always, or Mobile when expanded) --- */}
          <div className={`${isMobileSearchOpen ? 'flex flex-col animate-in fade-in slide-in-from-top-4 duration-200' : 'hidden md:block'}`}>
            
            {/* Mobile Form Header (Close Button) */}
            {isMobileSearchOpen && (
              <div className="md:hidden flex justify-between items-center mb-4 px-2">
                <h2 className="font-bold text-lg text-gray-900">Search details</h2>
                <button 
                  type="button" 
                  onClick={() => setIsMobileSearchOpen(false)} 
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            <form 
              onSubmit={fetchListings}
              className="flex flex-col md:flex-row md:items-center border border-gray-200 rounded-3xl md:rounded-full shadow-lg md:shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-white md:divide-x divide-gray-200 overflow-hidden"
            >
              {/* Where Section */}
              <div className="flex flex-col px-6 py-4 md:py-3 focus-within:bg-gray-100 hover:bg-gray-100 transition cursor-pointer w-full md:w-[35%]">
                <label className="text-xs font-bold text-gray-900 tracking-wide mb-1">Where</label>
                <input 
                  type="text" 
                  placeholder="Search destinations" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="text-sm font-medium text-gray-900 bg-transparent outline-none w-full placeholder-gray-500"
                />
              </div>
              
              {/* When Section */}
              <div className="flex flex-col px-6 py-4 md:py-3 border-t border-gray-200 md:border-t-0 focus-within:bg-gray-100 hover:bg-gray-100 transition cursor-pointer w-full md:w-[35%]">
                <label className="text-xs font-bold text-gray-900 tracking-wide mb-1">When</label>
                <div className="flex items-center bg-transparent gap-2">
                  <input 
                    type="date" 
                    min={today}
                    value={searchCheckIn}
                    onChange={(e) => setSearchCheckIn(e.target.value)}
                    className="text-sm font-medium text-gray-900 bg-transparent outline-none w-[110px] cursor-pointer"
                  />
                  <span className="text-gray-300">-</span>
                  <input 
                    type="date" 
                    min={searchCheckIn || today}
                    value={searchCheckOut}
                    onChange={(e) => setSearchCheckOut(e.target.value)}
                    className="text-sm font-medium text-gray-900 bg-transparent outline-none w-[110px] cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Who Section */}
              <div className="flex items-center justify-between px-6 py-4 md:py-2 md:pl-6 md:pr-2 border-t border-gray-200 md:border-t-0 focus-within:bg-gray-100 hover:bg-gray-100 transition cursor-pointer w-full md:w-[30%]">
                <div className="flex flex-col flex-1">
                  <label className="text-xs font-bold text-gray-900 tracking-wide mb-1">Who</label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Add guests" 
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                    className="text-sm font-medium text-gray-900 bg-transparent outline-none w-full placeholder-gray-500"
                  />
                </div>
                
                {/* Desktop Red Search Button (Circle) */}
                <button 
                  type="submit" 
                  className="hidden md:flex bg-brand h-12 w-12 rounded-full text-white ml-2 hover:bg-rose-600 transition items-center justify-center shrink-0 shadow-sm"
                >
                  <Search className="h-5 w-5" strokeWidth={3} />
                </button>
              </div>

              {/* Mobile Red Search Button (Full Width) */}
              <div className="md:hidden p-4 bg-white border-t border-gray-100">
                <button 
                  type="submit" 
                  className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-rose-600 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Search className="h-5 w-5" strokeWidth={3} /> Search
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
              className="px-6 py-3 border border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
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