// client/src/pages/EditListing.jsx

import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, MapPin, DollarSign, CheckCircle2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function EditListing() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null); // Added Toast State
  
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: '', location: '', googleMapsUrl: '',
    maxGuests: 1, bedrooms: 1, beds: 1, baths: 1,
    pricePerNight: 0, cleaningFee: 0, discountPct: 0,
    hasWifi: false, hasPool: false, hasKitchen: false, hasParking: false, hasAc: false, hasTv: false,
    hasWasher: false, hasDryer: false, hasHeating: false, hasWorkspace: false, hasGym: false, hasHotTub: false
  });

  const amenitiesList = [
    { id: 'Wifi', label: 'Wifi' }, { id: 'Pool', label: 'Pool' }, { id: 'Kitchen', label: 'Kitchen' },
    { id: 'Parking', label: 'Free Parking' }, { id: 'Ac', label: 'A/C' }, { id: 'Tv', label: 'TV' },
    { id: 'Washer', label: 'Washer' }, { id: 'Dryer', label: 'Dryer' }, { id: 'Heating', label: 'Heating' },
    { id: 'Workspace', label: 'Dedicated Workspace' }, { id: 'Gym', label: 'Gym' }, { id: 'HotTub', label: 'Hot Tub' }
  ];

  // Auto-hide toast logic
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (!token) return navigate('/login');

    const fetchListing = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`);
        if (!response.ok) throw new Error('Failed to load listing details');
        const data = await response.json();
        
        if (data.hostId !== user.id) {
            throw new Error('You do not have permission to edit this listing.');
        }

        // Pre-fill form
        setFormData({
            title: data.title, description: data.description, propertyType: data.propertyType, 
            location: data.location, googleMapsUrl: data.googleMapsUrl || '',
            maxGuests: data.maxGuests, bedrooms: data.bedrooms, beds: data.beds, baths: data.baths,
            pricePerNight: data.pricePerNight, cleaningFee: data.cleaningFee, discountPct: data.discountPct,
            hasWifi: data.hasWifi, hasPool: data.hasPool, hasKitchen: data.hasKitchen, 
            hasParking: data.hasParking, hasAc: data.hasAc, hasTv: data.hasTv,
            hasWasher: data.hasWasher, hasDryer: data.hasDryer, hasHeating: data.hasHeating, 
            hasWorkspace: data.hasWorkspace, hasGym: data.hasGym, hasHotTub: data.hasHotTub
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, token, navigate, user.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update listing');

      // Trigger the beautiful success toast
      setToastMessage({ type: 'success', text: 'Property updated! Guests notified.' });
      
      // Delay navigation so the user can actually see the toast animation
      setTimeout(() => {
        navigate('/my-properties');
      }, 2000);

    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitting(false); // Only reset if there's an error so the button stays in "loading" state during redirect
    } 
  };

  if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="animate-spin text-brand h-10 w-10"/></div>;

  return (
    <>
      {/* BEAUTIFUL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-8 fade-in duration-300 pointer-events-none w-[90%] max-w-md flex justify-center">
          <div className="bg-gray-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 w-auto min-w-max">
            {toastMessage.type === 'success' && <div className="bg-[#FF385C] rounded-full p-1 shrink-0"><CheckCircle className="h-4 w-4 text-white" /></div>}
            {toastMessage.type === 'error' && <div className="bg-red-500 rounded-full p-1 shrink-0"><AlertCircle className="h-4 w-4 text-white" /></div>}
            <span className="font-medium text-sm truncate">{toastMessage.text}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Edit your listing</h1>
        <p className="text-gray-500 mb-8 text-sm bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <span className="font-bold text-yellow-800">Note:</span> If you update these details, guests who have already booked this property will receive an automatic notification so they are aware of the changes before they arrive. Images cannot be edited after publishing.
        </p>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Basics */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Home className="text-brand h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">The Basics</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Listing Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white">
                  <option>Entire home</option><option>Private room</option><option>Shared room</option>
                  <option>Apartment</option><option>Cabin</option><option>Villa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Location & Space Details */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <MapPin className="text-brand h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Location & Capacity</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed URL</label>
                <input type="text" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Guests</label>
                <input type="number" name="maxGuests" min="1" required value={formData.maxGuests} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bedrooms</label>
                <input type="number" name="bedrooms" min="0" required value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Beds</label>
                <input type="number" name="beds" min="1" required value={formData.beds} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Baths</label>
                <input type="number" step="0.5" name="baths" min="0" required value={formData.baths} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
            </div>
          </div>

          {/* Section 3: Amenities Checklists */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <CheckCircle2 className="text-brand h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Amenities</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenitiesList.map(amenity => (
                <label key={amenity.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${formData[`has${amenity.id}`] ? 'border-brand bg-rose-50' : 'border-gray-200 hover:border-brand'}`}>
                  <input type="checkbox" name={`has${amenity.id}`} checked={formData[`has${amenity.id}`]} onChange={handleChange} className="w-5 h-5 accent-brand" />
                  <span className="font-medium text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 4: Pricing */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <DollarSign className="text-brand h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Pricing Strategy</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price per Night (₹)</label>
                <input type="number" name="pricePerNight" min="1" required value={formData.pricePerNight} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cleaning Fee (₹)</label>
                <input type="number" name="cleaningFee" min="0" value={formData.cleaningFee} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
                <input type="number" name="discountPct" min="0" max="100" value={formData.discountPct} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6 border-t flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/my-properties')} className="px-6 py-4 font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-brand text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-rose-600 transition disabled:opacity-50">
              {isSubmitting && <Loader2 className="h-6 w-6 animate-spin" />}
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}