// client/src/components/ListingCard.jsx

import { useState, useContext } from 'react';
import { Star, Heart, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ListingCard({ listing }) {
  const { user, toggleWishlist } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to control our new beautiful popup
  const [showHostAlert, setShowHostAlert] = useState(false);

  // Check if this listing is in the user's wishlist array
  const isWishlisted = user?.wishlistIds?.includes(listing.id);
  
  // Check if the current user is the host of this specific listing
  const isHost = user && user.id === listing.hostId;

  const handleWishlistClick = (e) => {
    e.preventDefault();  // Stop default navigation
    e.stopPropagation(); // Stop event bubbling to the parent Link
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Instead of a browser alert, trigger our custom modal
    if (isHost) {
      setShowHostAlert(true);
      return; 
    }

    toggleWishlist(listing.id);
  };

  return (
    <>
      {/* --- BEAUTIFUL HOST ALERT POPUP --- */}
      {showHostAlert && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowHostAlert(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Prevent clicks inside the white box from closing it
            }}
          >
            <div className="h-16 w-16 bg-red-50 text-[#FF385C] rounded-full flex items-center justify-center mb-5">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Wait a second!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You cannot add your own properties to your wishlist.
            </p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowHostAlert(false);
              }}
              className="w-full bg-[#FF385C] text-white font-bold py-3.5 rounded-xl hover:bg-rose-600 transition shadow-sm active:scale-[0.98]"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      {/* ---------------------------------- */}

      <Link to={`/listings/${listing.id}`} className="group cursor-pointer flex flex-col gap-3">
        {/* Image Container with strict aspect ratio */}
        <div className="aspect-[20/19] w-full overflow-hidden rounded-xl bg-gray-200 relative">
          <img
            src={listing.coverImage}
            alt={listing.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
            loading="lazy"
          />
          
          {/* Dynamic Wishlist Button */}
          <button 
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-1 hover:scale-110 transition active:scale-95 z-10"
          >
            <Heart 
              className={`h-[26px] w-[26px] drop-shadow-md transition ${
                isWishlisted 
                  ? 'fill-[#FF385C] text-[#FF385C]' 
                  : 'fill-black/40 text-white stroke-[2px]'
              }`} 
            />
          </button>
        </div>

        {/* Property Details */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="font-medium text-gray-900 truncate max-w-[200px]">{listing.location}</h3>
            <p className="text-gray-500 text-sm truncate max-w-[200px]">{listing.title}</p>
            <p className="text-gray-500 text-sm">{listing.beds} {listing.beds === 1 ? 'bed' : 'beds'}</p>
            <div className="mt-1 flex items-center gap-1">
              <span className="font-medium text-gray-900">${listing.pricePerNight}</span>
              <span className="text-gray-900 text-sm">night</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
            <span className="font-medium text-gray-900">{listing.avgRating || 'New'}</span>
          </div>
        </div>
      </Link>
    </>
  );
}