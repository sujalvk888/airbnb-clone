// client/src/pages/CreateListing.jsx

import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, MapPin, DollarSign, Loader2, Image as ImageIcon, 
  Wifi, Waves, ChefHat, Car, Wind, Tv, Shirt, Fan, Flame, Monitor, Dumbbell, Bath,
  Plus, Minus, Building, Tent, Castle, Hotel, Star, X
} from 'lucide-react';

export default function CreateListing() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- Step Management ---
  // 0: Main Intro, 1: Step 1 Intro, 2: Type, 3: Location, 4: Capacity
  // 5: Step 2 Intro, 6: Title, 7: Description, 8: Amenities, 9: Photos
  // 10: Step 3 Intro, 11: Pricing & Publish
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 11; 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // --- Property Data State ---
  const [formData, setFormData] = useState({
    title: '', description: '', propertyType: 'Entire home', location: '', googleMapsUrl: '',
    maxGuests: 4, bedrooms: 1, beds: 1, baths: 1,
    pricePerNight: 4000, cleaningFee: 0, discountPct: 0,
    hasWifi: false, hasPool: false, hasKitchen: false, hasParking: false, hasAc: false, hasTv: false,
    hasWasher: false, hasDryer: false, hasHeating: false, hasWorkspace: false, hasGym: false, hasHotTub: false
  });

  const propertyTypes = [
    { id: 'Entire home', icon: <Home className="h-8 w-8 mb-2" /> },
    { id: 'Private room', icon: <Building className="h-8 w-8 mb-2" /> },
    { id: 'Shared room', icon: <Hotel className="h-8 w-8 mb-2" /> },
    { id: 'Apartment', icon: <Building className="h-8 w-8 mb-2" /> },
    { id: 'Cabin', icon: <Tent className="h-8 w-8 mb-2" /> },
    { id: 'Villa', icon: <Castle className="h-8 w-8 mb-2" /> }
  ];

  const amenitiesList = [
    { id: 'Wifi', label: 'Wifi', icon: <Wifi className="h-8 w-8 mb-2"/> }, 
    { id: 'Pool', label: 'Pool', icon: <Waves className="h-8 w-8 mb-2"/> }, 
    { id: 'Kitchen', label: 'Kitchen', icon: <ChefHat className="h-8 w-8 mb-2"/> },
    { id: 'Parking', label: 'Parking', icon: <Car className="h-8 w-8 mb-2"/> }, 
    { id: 'Ac', label: 'A/C', icon: <Wind className="h-8 w-8 mb-2"/> }, 
    { id: 'Tv', label: 'TV', icon: <Tv className="h-8 w-8 mb-2"/> },
    { id: 'Washer', label: 'Washer', icon: <Shirt className="h-8 w-8 mb-2"/> }, 
    { id: 'Dryer', label: 'Dryer', icon: <Fan className="h-8 w-8 mb-2"/> }, 
    { id: 'Heating', label: 'Heating', icon: <Flame className="h-8 w-8 mb-2"/> },
    { id: 'Workspace', label: 'Workspace', icon: <Monitor className="h-8 w-8 mb-2"/> }, 
    { id: 'Gym', label: 'Gym', icon: <Dumbbell className="h-8 w-8 mb-2"/> }, 
    { id: 'HotTub', label: 'Hot Tub', icon: <Bath className="h-8 w-8 mb-2"/> }
  ];

  // --- Image State ---
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateCapacity = (field, delta) => {
    setFormData(prev => {
      const newValue = prev[field] + delta;
      // Prevent negative values. Beds and Guests must be at least 1. Baths and Bedrooms can be 0.
      if (field === 'maxGuests' || field === 'beds') {
        return { ...prev, [field]: Math.max(1, newValue) };
      }
      return { ...prev, [field]: Math.max(0, newValue) };
    });
  };

  const toggleAmenity = (id) => {
    setFormData(prev => ({ ...prev, [`has${id}`]: !prev[`has${id}`] }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      setError('You can only upload exactly 5 images.');
      return;
    }
    const newFiles = [...imageFiles, ...files].slice(0, 5);
    setImageFiles(newFiles);
    setPreviewUrls(newFiles.map(file => URL.createObjectURL(file)));
    setError('');
  };

  const removeImage = (indexToRemove) => {
    const newFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    setImageFiles(newFiles);
    setPreviewUrls(newFiles.map(file => URL.createObjectURL(file)));
    if (coverIndex === indexToRemove) setCoverIndex(0);
    else if (coverIndex > indexToRemove) setCoverIndex(prev => prev - 1);
  };

  // --- Navigation & Validation ---
  const handleNext = () => {
    setError('');
    
    // Step Validation Rules
    if (currentStep === 3 && !formData.location) return setError('Location is required.');
    if (currentStep === 6 && !formData.title) return setError('Please enter a title for your place.');
    if (currentStep === 7 && !formData.description) return setError('Please enter a description.');
    if (currentStep === 9 && imageFiles.length !== 5) return setError('Exactly 5 photos are required to continue.');
    if (currentStep === 11 && formData.pricePerNight < 1) return setError('Price per night must be greater than 0.');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
      submitData.append('coverImageIndex', coverIndex);
      imageFiles.forEach(file => submitData.append('images', file));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create listing');

      navigate('/my-properties');
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // --- RENDER CURRENT STEP ---
  const renderStepContent = () => {
    switch (currentStep) {
      // INTRO SCREEN
      case 0:
        return (
          <div className="flex flex-col md:flex-row items-center min-h-[70vh] gap-12 animate-in fade-in duration-500">
            <div className="w-full md:w-1/2 flex justify-center md:justify-start">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">It’s easy to get started on Airbnb</h1>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              
              {/* Step 1 with dynamic image */}
              <div className="flex items-start gap-4 border-b pb-6">
                <span className="text-2xl font-bold text-gray-900 w-8">1</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Tell us about your place</h3>
                  <p className="text-gray-500 mt-1">Share some basic info, such as where it is and how many guests can stay.</p>
                </div>
                <div className="flex-shrink-0">
                  <img 
                    src="https://a0.muscache.com/im/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg?im_w=720" 
                    alt="Step 1 Preview" 
                    className="h-[76px] w-[76px] sm:h-[90px] sm:w-[90px] object-contain mix-blend-multiply" 
                  />
                </div>
              </div>

              {/* Step 2 with dynamic image */}
              <div className="flex items-start gap-4 border-b pb-6">
                <span className="text-2xl font-bold text-gray-900 w-8">2</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Make it stand out</h3>
                  <p className="text-gray-500 mt-1">Add 5 photos plus a title and description — we'll help you out.</p>
                </div>
                <div className="flex-shrink-0">
                  <img 
                    src="https://a0.muscache.com/im/pictures/bfc0bc89-58cb-4525-a26e-7b23b750ee00.jpg?im_w=720" 
                    alt="Step 2 Preview" 
                    className="h-[76px] w-[76px] sm:h-[90px] sm:w-[90px] object-contain mix-blend-multiply" 
                  />
                </div>
              </div>

              {/* Step 3 with dynamic image */}
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-gray-900 w-8">3</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Finish up and publish</h3>
                  <p className="text-gray-500 mt-1">Choose a starting price, verify a few details, then publish your listing.</p>
                </div>
                <div className="flex-shrink-0">
                  <img 
                    src="https://a0.muscache.com/im/pictures/c0634c73-9109-4710-8968-3e927df1191c.jpg?im_w=720" 
                    alt="Step 3 Preview" 
                    className="h-[76px] w-[76px] sm:h-[90px] sm:w-[90px] object-contain mix-blend-multiply" 
                  />
                </div>
              </div>

            </div>
          </div>
        );

      // STEP 1 INTRO (WITH VIDEO)
      case 1:
        return (
          <div className="flex flex-col md:flex-row items-center min-h-[70vh] gap-12 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="w-full md:w-1/2">
              <span className="text-lg font-bold text-gray-900">Step 1</span>
              <h1 className="text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">Tell us about your place</h1>
              <p className="text-xl text-gray-600">In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <video 
                autoPlay 
                muted 
                playsInline 
                preload="auto"
                crossOrigin="anonymous" 
                className="w-full max-w-md h-auto object-cover rounded-3xl shadow-lg"
              >
                <source src="https://stream.media.muscache.com/zFaydEaihX6LP01x8TSCl76WHblb01Z01RrFELxyCXoNek.mp4?v_q=high" type="video/mp4" />
              </video>
            </div>
          </div>
        );

      // PROPERTY TYPE
      case 2:
        return (
          <div className="max-w-3xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">Which of these best describes your place?</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {propertyTypes.map((pt) => (
                <div 
                  key={pt.id} 
                  onClick={() => setFormData(prev => ({ ...prev, propertyType: pt.id }))}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition ${formData.propertyType === pt.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-900'}`}
                >
                  {pt.icon}
                  <span className="font-bold text-gray-900">{pt.id}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // LOCATION
      case 3:
        return (
          <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">Where's your place located?</h1>
            <div className="space-y-6">
              <div className="bg-white p-4 border border-gray-400 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">City, Country</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Manali, India" className="w-full mt-1 text-lg outline-none bg-transparent" />
              </div>
              <div className="bg-white p-4 border border-gray-400 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Google Maps Embed URL (Optional)</label>
                <input type="text" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} placeholder="Paste map iframe src here" className="w-full mt-1 outline-none bg-transparent" />
              </div>
            </div>
          </div>
        );

      // CAPACITY
      case 4:
        return (
          <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">Share some basics about your place</h1>
            <div className="space-y-6">
              {['Guests', 'Bedrooms', 'Beds', 'Baths'].map((item) => {
                const fieldName = item === 'Guests' ? 'maxGuests' : item.toLowerCase();
                const step = fieldName === 'baths' ? 0.5 : 1;
                return (
                  <div key={item} className="flex justify-between items-center py-6 border-b border-gray-200">
                    <span className="text-xl text-gray-900">{item}</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => updateCapacity(fieldName, -step)} className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition"><Minus className="h-4 w-4" /></button>
                      <span className="text-xl w-6 text-center">{formData[fieldName]}</span>
                      <button onClick={() => updateCapacity(fieldName, step)} className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // STEP 2 INTRO (WITH VIDEO)
      case 5:
        return (
          <div className="flex flex-col md:flex-row items-center min-h-[70vh] gap-12 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="w-full md:w-1/2">
              <span className="text-lg font-bold text-gray-900">Step 2</span>
              <h1 className="text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">Make your place stand out</h1>
              <p className="text-xl text-gray-600">In this step, you'll add some of the amenities your place offers, plus exactly 5 photos. Then you'll create a title and description.</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <video 
                autoPlay 
                muted 
                playsInline 
                preload="auto"
                crossOrigin="anonymous" 
                className="w-full max-w-md h-auto object-cover rounded-3xl shadow-lg"
              >
                <source src="https://stream.media.muscache.com/H0101WTUG2qWbyFhy02jlOggSkpsM9H02VOWN52g02oxhDVM.mp4?v_q=high" type="video/mp4" />
              </video>
            </div>
          </div>
        );

      // TITLE
      case 6:
        return (
          <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Now, let's give your house a title</h1>
            <p className="text-gray-500 mb-8">Short titles work best. Have fun with it—you can always change it later.</p>
            <textarea 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              rows="3"
              className="w-full p-6 text-2xl border border-gray-400 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition outline-none resize-none"
            />
          </div>
        );

      // DESCRIPTION
      case 7:
        return (
          <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Create your description</h1>
            <p className="text-gray-500 mb-8">Share what makes your place special.</p>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="6"
              className="w-full p-6 text-lg border border-gray-400 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition outline-none resize-none"
            />
          </div>
        );

      // AMENITIES
      case 8:
        return (
          <div className="max-w-3xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Tell guests what your place has to offer</h1>
            <p className="text-gray-500 mb-8">You can add more amenities after you publish.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenitiesList.map(amenity => (
                <div 
                  key={amenity.id} 
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex flex-col justify-center p-6 border-2 rounded-2xl cursor-pointer transition ${formData[`has${amenity.id}`] ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-900'}`}
                >
                  {amenity.icon}
                  <span className="font-bold text-gray-900">{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // PHOTOS
      case 9:
        return (
          <div className="max-w-3xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Add 5 photos of your place</h1>
              <span className={`text-sm font-bold ${imageFiles.length === 5 ? 'text-green-600' : 'text-gray-500'}`}>{imageFiles.length} / 5</span>
            </div>
            <p className="text-gray-500 mb-8">You'll need exactly 5 photos to get started.</p>
            
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition mb-8">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-gray-900 font-bold underline">Click to upload photos</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} disabled={imageFiles.length >= 5} />
            </label>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className={`relative rounded-2xl overflow-hidden aspect-video border-4 transition ${coverIndex === idx ? 'border-gray-900 shadow-md' : 'border-transparent'}`}>
                    <img src={url} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setCoverIndex(idx)} className={`absolute top-2 left-2 text-xs font-bold px-3 py-1 rounded-lg shadow-sm transition ${coverIndex === idx ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}>
                      {coverIndex === idx ? 'Cover Photo' : 'Set as Cover'}
                    </button>
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-white text-gray-900 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm transition"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      // STEP 3 INTRO (WITH VIDEO)
      case 10:
        return (
          <div className="flex flex-col md:flex-row items-center min-h-[70vh] gap-12 animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="w-full md:w-1/2">
              <span className="text-lg font-bold text-gray-900">Step 3</span>
              <h1 className="text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">Finish up and publish</h1>
              <p className="text-xl text-gray-600">Finally, you'll choose your starting price, verify a few details, and publish your listing.</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <video 
                autoPlay 
                muted 
                playsInline 
                preload="auto"
                crossOrigin="anonymous" 
                className="w-full max-w-md h-auto object-cover rounded-3xl shadow-lg"
              >
                <source src="https://stream.media.muscache.com/KeNKUpa01dRaT5g00SSBV95FqXYkqf01DJdzn01F1aT00vCI.mp4?v_q=high" type="video/mp4" />
              </video>
            </div>
          </div>
        );

      // PRICING & PUBLISH
      case 11:
        return (
          <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[70vh] animate-in slide-in-from-right-8 fade-in duration-500">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Now, set your price</h1>
            <p className="text-gray-500 mb-10">You can change it anytime.</p>

            <div className="space-y-6">
              <div className="bg-white p-4 border border-gray-400 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition text-center">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide text-left mb-2">Price per Night</label>
                <div className="flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-900 mr-2">₹</span>
                  <input type="number" name="pricePerNight" min="1" value={formData.pricePerNight} onChange={handleChange} className="text-6xl font-bold text-gray-900 bg-transparent outline-none w-48 appearance-none text-center" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 border border-gray-400 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Cleaning Fee (₹)</label>
                  <input type="number" name="cleaningFee" min="0" value={formData.cleaningFee} onChange={handleChange} className="w-full text-xl outline-none bg-transparent" />
                </div>
                <div className="bg-white p-4 border border-gray-400 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900 transition">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Discount (%)</label>
                  <input type="number" name="discountPct" min="0" max="100" value={formData.discountPct} onChange={handleChange} className="w-full text-xl outline-none bg-transparent" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] pb-24 flex flex-col bg-white">
      
      {/* Top Fixed Warning Banner for Errors */}
      {error && (
        <div className="fixed top-16 left-0 w-full bg-red-500 text-white text-center py-3 font-bold z-40 animate-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {/* Dynamic Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center">
        <div className="w-full">
          {renderStepContent()}
        </div>
      </div>

      {/* --- FIXED BOTTOM NAVIGATION BAR --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white z-50">
        {/* Dynamic Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
          <div className="h-full bg-gray-900 transition-all duration-500 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center h-20">
          <div>
            {currentStep > 0 && (
              <button onClick={handleBack} className="text-gray-900 font-bold underline hover:bg-gray-100 px-6 py-3 rounded-lg transition">
                Back
              </button>
            )}
          </div>
          
          <div>
            {currentStep === 0 ? (
               <button onClick={handleNext} className="bg-[#FF385C] text-white font-bold px-8 py-3.5 rounded-lg hover:bg-rose-600 transition active:scale-95">
                 Get started
               </button>
            ) : currentStep < totalSteps ? (
              <button onClick={handleNext} className="bg-gray-900 text-white font-bold px-10 py-3.5 rounded-lg hover:bg-black transition active:scale-95">
                Next
              </button>
            ) : (
              <button onClick={handleNext} disabled={isSubmitting} className="flex items-center gap-2 bg-[#FF385C] text-white font-bold px-10 py-3.5 rounded-lg hover:bg-rose-600 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}