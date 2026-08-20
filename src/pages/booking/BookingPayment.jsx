import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Shield, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import BookingStepper from '../../components/booking/BookingStepper';
import Button from '../../components/ui/Button';
import { bookingSteps, mockBookingVehicle } from '../../mocks/booking';
import paymentService from '../../services/paymentService';

const BookingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const bookingData = location.state || {
    vehicle: mockBookingVehicle,
    pickupDate: '2026-08-25',
    returnDate: '2026-08-28',
    days: 3,
    rentalAmount: 10500,
    totalAmount: 17500,
    bookingId: null,
  };
  
  const { totalAmount, bookingId } = bookingData;
  
  const handlePayNow = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Check if booking exists
      if (!bookingId) {
        throw new Error('Booking ID missing. Please go back and try again.');
      }
      
      // ✅ Real payment initiate
      const response = await paymentService.initiate(bookingId);
      const { gatewayUrl, transactionId } = response.data || response;
      
      console.log('🔍 Payment initiated:', { gatewayUrl, transactionId });
      
      if (gatewayUrl) {
        // ✅ Redirect to SSLCommerz
        window.location.href = gatewayUrl;
      } else {
        throw new Error('Payment gateway URL not received');
      }
    } catch (error) {
      console.error('❌ Payment failed:', error);
      setError(error.response?.data?.message || error.message || 'Payment initiation failed');
      setIsProcessing(false);
    }
  };
  
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