// client/src/pages/CreateListing.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Image as ImageIcon, MapPin, DollarSign, Users, CheckCircle2, Loader2 } from 'lucide-react';

export default function CreateListing() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Property Data State (Updated with 6 new amenities)
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: 'Entire home', location: '', googleMapsUrl: '',
    maxGuests: 1, bedrooms: 1, beds: 1, baths: 1,
    pricePerNight: 50, cleaningFee: 0, discountPct: 0,
    hasWifi: false, hasPool: false, hasKitchen: false, hasParking: false, hasAc: false, hasTv: false,
    hasWasher: false, hasDryer: false, hasHeating: false, hasWorkspace: false, hasGym: false, hasHotTub: false
  });

  // Array to cleanly map out the UI
  const amenitiesList = [
    { id: 'Wifi', label: 'Wifi' },
    { id: 'Pool', label: 'Pool' },
    { id: 'Kitchen', label: 'Kitchen' },
    { id: 'Parking', label: 'Free Parking' },
    { id: 'Ac', label: 'A/C' },
    { id: 'Tv', label: 'TV' },
    { id: 'Washer', label: 'Washer' },
    { id: 'Dryer', label: 'Dryer' },
    { id: 'Heating', label: 'Heating' },
    { id: 'Workspace', label: 'Dedicated Workspace' },
    { id: 'Gym', label: 'Gym' },
    { id: 'HotTub', label: 'Hot Tub' }
  ];

  // Image State
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 5) {
      setError('You can only upload exactly 5 images.');
      return;
    }

    const newFiles = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(newFiles);
    
    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
    setError('');
  };

  const removeImage = (indexToRemove) => {
    const newFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    setImageFiles(newFiles);
    setPreviewUrls(newFiles.map(file => URL.createObjectURL(file)));
    if (coverIndex === indexToRemove) setCoverIndex(0);
    else if (coverIndex > indexToRemove) setCoverIndex(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (imageFiles.length !== 5) {
      setError('Exactly 5 images are required to publish a listing.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      
      // Append all standard fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append Cover Index
      submitData.append('coverImageIndex', coverIndex);

      // Append 5 image files
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to create listing');

      // On success, redirect back to home dashboard (we will build this next)
      navigate('/');
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">You must be logged in to host.</h2>
        <button onClick={() => navigate('/login')} className="bg-brand text-white px-6 py-2 rounded-lg font-bold">Log In</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Airbnb your home</h1>
      <p className="text-gray-500 mb-8">It's easy to get started. Fill out the details below to publish your space.</p>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">
          {error}
        </div>
      )}

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
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Luxury Beachfront Villa"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} placeholder="Describe what makes your space special..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none bg-white">
                <option>Entire home</option>
                <option>Private room</option>
                <option>Shared room</option>
                <option>Apartment</option>
                <option>Cabin</option>
                <option>Villa</option>
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Location (City, Country)</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g. Bali, Indonesia"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed URL (Optional)</label>
              <input type="text" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} placeholder="Paste iframe src url here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand outline-none text-sm" />
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Price per Night ($)</label>
              <input type="number" name="pricePerNight" min="1" required value={formData.pricePerNight} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cleaning Fee ($)</label>
              <input type="number" name="cleaningFee" min="0" value={formData.cleaningFee} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
              <input type="number" name="discountPct" min="0" max="100" value={formData.discountPct} onChange={handleChange} placeholder="e.g. 10 for 10%" className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
            </div>
          </div>
        </div>

        {/* Section 5: The 5 Images */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="text-brand h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Photos (Exactly 5)</h2>
            </div>
            <span className="text-sm font-bold text-gray-500">{imageFiles.length} / 5 uploaded</span>
          </div>
          
          <div className="mb-6">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-sm text-gray-500 font-bold"><span className="text-brand">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG (Must upload exactly 5)</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} disabled={imageFiles.length >= 5} />
            </label>
          </div>

          {previewUrls.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-500 mb-4">Click a badge to set as your Cover Image.</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className={`relative rounded-xl overflow-hidden border-4 transition ${coverIndex === idx ? 'border-brand shadow-lg' : 'border-transparent'}`}>
                    <img src={url} alt={`Preview ${idx}`} className="h-24 w-full object-cover" />
                    
                    <button type="button" onClick={() => setCoverIndex(idx)} 
                      className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded shadow-sm ${coverIndex === idx ? 'bg-brand text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                      {coverIndex === idx ? 'Cover' : 'Set Cover'}
                    </button>
                    
                    <button type="button" onClick={() => removeImage(idx)} 
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shadow-sm hover:bg-red-600">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-6 border-t flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting || imageFiles.length !== 5}
            className="flex items-center gap-2 bg-brand text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="h-6 w-6 animate-spin" />}
            {isSubmitting ? 'Publishing Listing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}