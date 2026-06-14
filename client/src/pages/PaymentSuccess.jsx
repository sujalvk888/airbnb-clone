// client/src/pages/PaymentSuccess.jsx

import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  
  // Use a ref to prevent strict mode from firing the confirm request twice
  const hasProcessed = useRef(false);

  useEffect(() => {
    const confirmBooking = async () => {
      if (hasProcessed.current || !token) return;
      hasProcessed.current = true;

      const sessionId = searchParams.get('session_id');
      const listingId = searchParams.get('listingId');
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      const guestCount = searchParams.get('guestCount');
      const totalPrice = searchParams.get('totalPrice');

      if (!sessionId || !listingId) {
        setStatus('error');
        setError('Missing required booking data. If you paid, please contact support.');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            listingId, checkIn, checkOut, guestCount, totalPrice, sessionId
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to confirm booking');
        }

        setStatus('success');
        
        // After 2.5 seconds of showing the success screen, redirect to My Trips
        setTimeout(() => {
          navigate('/my-trips');
        }, 2500);

      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    };

    confirmBooking();
  }, [searchParams, token, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full text-center">
        
        {status === 'processing' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 text-brand animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900">Confirming your trip...</h2>
            <p className="text-gray-500">Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500">Your reservation is confirmed. Redirecting to your itinerary...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-2xl">!</div>
            <h2 className="text-2xl font-bold text-gray-900">Confirmation Error</h2>
            <p className="text-red-600 bg-red-50 p-4 rounded-xl w-full">{error}</p>
            <button onClick={() => navigate('/my-trips')} className="mt-4 bg-brand text-white font-bold px-6 py-2 rounded-lg">Go to My Trips</button>
          </div>
        )}

      </div>
    </div>
  );
}