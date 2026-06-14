// client/src/pages/Home.jsx

import { useState, useEffect } from 'react';
import { Search, Map, Coffee, Trees, Waves, Mountain, Loader2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';

// Authentic Category Mock Data
const CATEGORIES = [
  { label: 'Amazing pools', icon: Waves },
  { label: 'Beachfront', icon: Map },
  { label: 'Cabins', icon: Trees },
  { label: 'Bed & breakfasts', icon: Coffee },
  { label: 'Amazing views', icon: Mountain },
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('Amazing pools');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`);
        if (!response.ok) throw new Error('Failed to load listings');
        
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Sub-Header: Search & Categories */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm pt-4 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Authentic Pill Search Bar */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition cursor-pointer divide-x divide-gray-200">
              <button className="px-6 py-3 text-sm font-medium text-gray-900 rounded-l-full hover:bg-gray-50">
                Anywhere
              </button>
              <button className="px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50">
                Any week
              </button>
              <button className="px-6 py-3 text-sm font-light text-gray-500 rounded-r-full hover:bg-gray-50 flex items-center gap-3">
                Add guests
                <div className="bg-brand p-2 rounded-full text-white">
                  <Search className="h-4 w-4" strokeWidth={3} />
                </div>
              </button>
            </div>
          </div>

          {/* Category Icons */}
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex flex-col items-center gap-2 min-w-max pb-2 border-b-2 transition ${
                    isActive 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-brand">
            <Loader2 className="h-10 w-10 animate-spin" />
            <p className="text-gray-500 font-medium">Loading amazing places...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl font-medium">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No exact matches</h2>
            <p className="text-gray-500">Try changing or removing some of your filters or creating a new listing.</p>
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