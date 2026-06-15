// client/src/pages/ListingDetail.jsx

import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Star, MapPin, Wifi, Waves, ChefHat, Car, Wind, Tv, 
  UserCircle, MessageCircle, Share, Heart, Loader2,
  X, ChevronRight // Added new icons for modals
} from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Widget State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // UI Modals State
  const [showDescModal, setShowDescModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Prevent background scrolling when a modal is open
  useEffect(() => {
    if (showDescModal || showImageModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showDescModal, showImageModal]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        if (!response.ok) throw new Error('Failed to load listing details');
        const data = await response.json();
        setListing(data);
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-brand animate-spin" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Oops!</h2>
        <p className="text-gray-500">{error || 'Listing not found.'}</p>
        <button onClick={() => navigate('/')} className="text-brand font-bold">Go back home</button>
      </div>
    );
  }

  // --- Dynamic Math & Display Logic ---
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  let days = 0;
  if (checkIn && checkOut && checkOutDate > checkInDate) {
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    days = Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  const basePrice = days * listing.pricePerNight;
  const discountAmount = listing.discountPct > 0 ? (basePrice * (listing.discountPct / 100)) : 0;
  const totalPrice = basePrice > 0 ? (basePrice + listing.cleaningFee - discountAmount) : 0;

  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const liveAvgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 'New';
  const isHost = user?.id === listing.hostId;

  // --- Map URL Logic ---
  let mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(listing.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  if (listing.googleMapsUrl) {
    const match = listing.googleMapsUrl.match(/src="([^"]+)"/);
    if (match) {
      mapSrc = match[1];
    } else {
      mapSrc = listing.googleMapsUrl;
    }
  }

  // --- Handlers ---
  const handleReserveClick = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!checkIn || !checkOut || days <= 0) {
      setBookingError("Please select valid check-in and check-out dates.");
      return;
    }

    setIsBooking(true);
    setBookingError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ listingId: id, checkIn, checkOut, guestCount: guests })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to initiate payment');

      if (data.url) {
        window.location.assign(data.url);
      } else {
        throw new Error('Did not receive a checkout URL from the server.');
      }
    } catch (err) {
      setBookingError(err.message);
      setIsBooking(false); 
    } 
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ listingId: id, rating: reviewRating, comment: reviewComment })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit review');

      setReviews([data, ...reviews]);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <>
      {/* ============================== */}
      {/* MODALS SECTION                 */}
      {/* ============================== */}

      {/* 1. Description Modal */}
      {showDescModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl relative">
            <div className="sticky top-0 bg-white rounded-t-2xl px-6 py-4 border-b border-gray-100 flex items-center">
              <button onClick={() => setShowDescModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>
            <div className="p-8 pt-6 overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About this space</h2>
              <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                {listing.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full Image Gallery Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in slide-in-from-bottom-8 duration-300">
          <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 z-10 flex items-center justify-between border-b border-gray-200">
            <button onClick={() => setShowImageModal(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition font-medium text-gray-900">
              <X className="h-5 w-5" /> Close
            </button>
            <div className="text-sm font-bold text-gray-900">{listing.images?.length || 0} photos</div>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
            {listing.images?.map((img, idx) => (
              <img 
                key={idx} 
                src={img.url} 
                alt={`Property full view ${idx}`} 
                className="w-full h-auto object-cover rounded-lg shadow-sm" 
              />
            ))}
          </div>
        </div>
      )}

      {/* ============================== */}
      {/* MAIN PAGE CONTENT              */}
      {/* ============================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                {liveAvgRating}
              </span>
              <span className="underline cursor-pointer">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
              <span className="flex items-center gap-1 underline cursor-pointer">
                <MapPin className="h-4 w-4" />
                {listing.location}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium underline">
              <button className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded-lg transition"><Share className="h-4 w-4" /> Share</button>
              <button className="flex items-center gap-1 hover:bg-gray-100 p-2 rounded-lg transition"><Heart className="h-4 w-4" /> Save</button>
            </div>
          </div>
        </div>

        {/* Responsive Image Gallery (Clickable) */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory rounded-xl gap-2 no-scrollbar">
          {listing.images?.map((img, idx) => (
            <img 
              key={idx} 
              src={img.url} 
              alt={`Property ${idx}`} 
              onClick={() => setShowImageModal(true)}
              className="h-64 w-full object-cover shrink-0 snap-center cursor-pointer active:opacity-90 transition" 
            />
          ))}
        </div>

        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] rounded-2xl overflow-hidden">
          {listing.images && listing.images.length === 5 && (
            <>
              <img onClick={() => setShowImageModal(true)} src={listing.images[0].url} alt="Cover" className="col-span-2 row-span-2 w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
              <img onClick={() => setShowImageModal(true)} src={listing.images[1].url} alt="Img 1" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
              <img onClick={() => setShowImageModal(true)} src={listing.images[2].url} alt="Img 2" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
              <img onClick={() => setShowImageModal(true)} src={listing.images[3].url} alt="Img 3" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
              <img onClick={() => setShowImageModal(true)} src={listing.images[4].url} alt="Img 4" className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer" />
            </>
          )}
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-12 mt-10">
          
          {/* Left Column: Details */}
          <div className="w-full lg:w-2/3">
            <div className="flex justify-between items-start pb-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{listing.propertyType} hosted by {listing.host.firstName}</h2>
                <div className="flex gap-2 text-gray-900 mt-1 font-light">
                  <span>{listing.maxGuests} guests</span> · 
                  <span>{listing.bedrooms} bedrooms</span> · 
                  <span>{listing.beds} beds</span> · 
                  <span>{listing.baths} baths</span>
                </div>
              </div>
              <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
                {listing.host.profileImage ? (
                  <img src={listing.host.profileImage} alt={listing.host.firstName} className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="h-full w-full text-gray-400" />
                )}
              </div>
            </div>

            {/* Description Area with Read More Logic */}
            <div className="py-6 border-b text-gray-700 whitespace-pre-line leading-relaxed">
              <div className="line-clamp-6">
                {listing.description}
              </div>
              {listing.description.length > 300 && (
                <button 
                  onClick={() => setShowDescModal(true)} 
                  className="flex items-center gap-1 font-bold underline mt-4 hover:text-gray-900 transition"
                >
                  Show more <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="py-6 border-b">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.hasWifi && <div className="flex items-center gap-4 text-gray-700"><Wifi className="h-6 w-6" /> <span>Fast Wifi</span></div>}
                {listing.hasPool && <div className="flex items-center gap-4 text-gray-700"><Waves className="h-6 w-6" /> <span>Private Pool</span></div>}
                {listing.hasKitchen && <div className="flex items-center gap-4 text-gray-700"><ChefHat className="h-6 w-6" /> <span>Full Kitchen</span></div>}
                {listing.hasParking && <div className="flex items-center gap-4 text-gray-700"><Car className="h-6 w-6" /> <span>Free Parking</span></div>}
                {listing.hasAc && <div className="flex items-center gap-4 text-gray-700"><Wind className="h-6 w-6" /> <span>Air Conditioning</span></div>}
                {listing.hasTv && <div className="flex items-center gap-4 text-gray-700"><Tv className="h-6 w-6" /> <span>Flatscreen TV</span></div>}
              </div>
            </div>

            {/* --- SMART GEOLOCATION MAP SECTION --- */}
            <div className="py-8 border-b">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Where you'll be</h3>
              <p className="text-gray-700 mb-6">{listing.location}</p>
              <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-gray-200 border border-gray-300 shadow-sm relative z-0">
                <iframe
                  title={`Map of ${listing.location}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                ></iframe>
              </div>
            </div>

            <div className="py-6 border-b">
               <h3 className="text-xl font-bold text-gray-900 mb-6">Meet your Host</h3>
               <div className="bg-gray-100 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-white shadow-md">
                      {listing.host.profileImage ? (
                        <img src={listing.host.profileImage} alt={listing.host.firstName} className="h-full w-full object-cover" />
                      ) : (
                        <UserCircle className="h-full w-full text-gray-400" />
                      )}
                    </div>
                    <span className="font-bold text-xl">{listing.host.firstName}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-4 justify-center">
                    <p className="text-gray-700">{listing.host.bio || "This host hasn't added a bio yet, but they're excited to welcome you!"}</p>
                    <a href={`mailto:${listing.host.email}?subject=Inquiry about ${listing.title}`} className="inline-flex items-center justify-center gap-2 border border-gray-900 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-50 transition w-full md:w-auto">
                      <MessageCircle className="h-5 w-5" /> Message Host
                    </a>
                  </div>
               </div>
            </div>

            {/* --- REVIEWS SECTION --- */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-8">
                <Star className="h-6 w-6 fill-gray-900 text-gray-900" />
                <h3 className="text-2xl font-bold text-gray-900">{liveAvgRating} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</h3>
              </div>

              {user && !isHost && (
                <div className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Leave a Review</h4>
                  {reviewError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{reviewError}</div>}
                  
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <select 
                        value={reviewRating} 
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand"
                      >
                        {[5, 4, 3, 2, 1].map(num => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                      <textarea 
                        required
                        rows="3"
                        placeholder="Share your experience..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-brand resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className="bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                          {rev.user.profileImage ? (
                            <img src={rev.user.profileImage} alt={rev.user.firstName} className="h-full w-full object-cover" />
                          ) : (
                            <UserCircle className="h-full w-full text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{rev.user.firstName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gray-900 text-gray-900"/> {rev.rating}</span>
                            <span>·</span>
                            <span>{new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed line-clamp-4">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="w-full lg:w-1/3 relative z-10">
            <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold text-gray-900">${listing.pricePerNight}</span>
                <span className="text-gray-600">night</span>
              </div>

              <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
                <div className="flex border-b border-gray-300">
                  <div className="w-1/2 p-3 border-r border-gray-300">
                    <label className="block text-[10px] font-bold uppercase text-gray-900">Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full outline-none text-sm bg-transparent cursor-pointer" />
                  </div>
                  <div className="w-1/2 p-3">
                    <label className="block text-[10px] font-bold uppercase text-gray-900">Check-out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn} className="w-full outline-none text-sm bg-transparent cursor-pointer" />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase text-gray-900">Guests</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full outline-none text-sm bg-transparent cursor-pointer mt-1">
                    {[...Array(listing.maxGuests)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleReserveClick}
                disabled={isBooking}
                className="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-rose-600 transition disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isBooking ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {isBooking ? 'Processing...' : 'Reserve'}
              </button>
              {bookingError && <p className="text-red-500 text-sm mt-3 text-center">{bookingError}</p>}
              <p className="text-center text-sm text-gray-500 mt-3 font-light">You won't be charged yet</p>

              {days > 0 && (
                <div className="mt-6 space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span className="underline">${listing.pricePerNight} x {days} nights</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  {listing.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="underline">Cleaning fee</span>
                      <span>${listing.cleaningFee.toFixed(2)}</span>
                    </div>
                  )}
                  {listing.discountPct > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Host discount ({listing.discountPct}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}