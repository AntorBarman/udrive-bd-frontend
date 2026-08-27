import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Shield, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import BookingStepper from '../../components/booking/BookingStepper';
import Button from '../../components/ui/Button';
import { bookingSteps } from '../../mocks/booking';
import paymentService from '../../services/paymentService';
import { toast } from 'react-toastify';

const BookingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingData, setBookingData] = useState(null);

  // ✅ Get booking data from multiple sources
  useEffect(() => {
    // 1. From location state
    const stateData = location.state || {};
    
    // 2. From localStorage (fallback)
    const storedBookingId = localStorage.getItem('currentBookingId');
    const storedTotal = localStorage.getItem('currentTotalAmount');
    
    // 3. From URL params
    const params = new URLSearchParams(location.search);
    const urlBookingId = params.get('booking_id');
    
    // Determine booking ID (priority: state > URL > localStorage)
    const finalBookingId = stateData.bookingId || 
                          stateData.booking?.id || 
                          urlBookingId || 
                          storedBookingId;
    
    // Determine total amount
    const finalTotal = stateData.totalAmount || 
                       stateData.booking?.total_amount || 
                       Number(storedTotal) || 
                       0;
    
    console.log('🔍 BookingPayment - Data:', {
      stateData,
      storedBookingId,
      finalBookingId,
      finalTotal
    });
    
    setBookingId(finalBookingId);
    setTotalAmount(finalTotal);
    setBookingData(stateData);
    
    // If no booking ID, show error and redirect
    if (!finalBookingId) {
      toast.error('Booking ID missing. Please go back and try again.');
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    }
  }, [location, navigate]);
  
  const handlePayNow = async () => {
    // ✅ Check if bookingId exists
    if (!bookingId) {
      toast.error('Booking ID missing. Please go back and try again.');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      console.log('🔍 Initiating payment for booking:', bookingId);
      
      const response = await paymentService.initiate(bookingId);
      console.log('✅ Payment response:', response);
      
      const gatewayUrl = response?.data?.gatewayUrl || 
                        response?.gatewayUrl || 
                        response?.data?.data?.gatewayUrl;
      
      if (gatewayUrl) {
        // ✅ Save booking ID for success page
        localStorage.setItem('currentBookingId', bookingId);
        window.location.href = gatewayUrl;
      } else {
        throw new Error('Payment gateway URL not received');
      }
    } catch (error) {
      console.error('❌ Payment failed:', error);
      const message = error.response?.data?.message || error.message || 'Payment initiation failed';
      setError(message);
      toast.error(message);
      setIsProcessing(false);
    }
  };
  
  // If no booking ID, show loading/error
  if (!bookingId) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Booking ID Missing</h2>
            <p className="text-slate-600 mb-4">Please go back and try again.</p>
            <Button onClick={() => navigate('/bookings')}>
              Go to My Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <BookingStepper currentStep={4} steps={bookingSteps} />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Secure Payment</h1>
          <p className="text-slate-500">Your payment is protected with SSLCommerz</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {/* Booking Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Booking ID</span>
            <span className="font-mono font-medium">{bookingId?.slice(0, 8)}</span>
          </div>
          {bookingData?.vehicle && (
            <div className="flex justify-between mt-1">
              <span className="text-slate-500">Vehicle</span>
              <span className="font-medium">{bookingData.vehicle.brand} {bookingData.vehicle.model}</span>
            </div>
          )}
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center mb-6">
          <p className="text-sm text-slate-500 mb-2">Total Amount</p>
          <p className="text-4xl font-bold text-slate-900">
            ৳{Number(totalAmount).toLocaleString('en-BD')}
          </p>
        </div>
        
        <Button
          fullWidth
          size="lg"
          onClick={handlePayNow}
          isLoading={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ৳${Number(totalAmount).toLocaleString('en-BD')}`}
        </Button>
        
        <div className="flex justify-center gap-6 mt-6">
          <span className="flex items-center gap-1 text-sm text-slate-500">
            <Lock className="w-4 h-4 text-green-600" /> Secure Payment
          </span>
          <span className="flex items-center gap-1 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-green-600" /> SSLCommerz
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingPayment;