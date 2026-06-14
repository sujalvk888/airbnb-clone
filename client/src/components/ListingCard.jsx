// client/src/components/ListingCard.jsx

import { Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    // Note: The Link destination will be built in Phase 7.
    <Link to={`/listings/${listing.id}`} className="group cursor-pointer flex flex-col gap-3">
      {/* Image Container with strict aspect ratio */}
      <div className="aspect-[20/19] w-full overflow-hidden rounded-xl bg-gray-200 relative">
        <img
          src={listing.coverImage}
          alt={listing.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
          loading="lazy"
        />
        {/* Mock Favorite Button */}
        <button className="absolute top-3 right-3 text-white hover:scale-110 transition active:scale-95">
          <Heart className="h-6 w-6 drop-shadow-md" />
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
        
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
          <span className="font-light text-sm">{listing.avgRating || 'New'}</span>
        </div>
      </div>
    </Link>
  );
}