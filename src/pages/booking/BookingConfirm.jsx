import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import BookingStepper from '../../components/booking/BookingStepper';
import BookingSummary from '../../components/booking/BookingSummary';
import PriceBreakdown from '../../components/booking/PriceBreakdown';
import Button from '../../components/ui/Button';
import { bookingSteps } from '../../mocks/booking';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';

const BookingConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const bookingData = location.state;

  console.log('🔍 Full bookingData:', bookingData);

  if (!bookingData || !bookingData.vehicle) {
    console.error('❌ No booking data found');
    toast.error('Booking data missing. Please start over.');
    navigate('/vehicles');
    return null;
  }

  const { vehicle, pickupDate, returnDate, days, rentalAmount, totalAmount } = bookingData;
  const vehicleId = vehicle?.id;

  const handleProceedToPayment = async () => {
    if (!agreed) {
      toast.warning('Please agree to the terms and conditions');
      return;
    }

    if (!vehicleId) {
      toast.error('Vehicle ID is missing!');
      console.error('❌ Vehicle ID missing:', vehicle);
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select pickup and return dates');
      return;
    }

    setApiError('');
    setIsLoading(true);

    try {
      const bookingPayload = {
        vehicleId: vehicleId,
        pickupDate: pickupDate,
        returnDate: returnDate,
        pickupTime: '10:00',
        returnTime: '10:00',
      };

      console.log('🔍 Sending to backend:', bookingPayload);

      const response = await bookingService.create(bookingPayload);
      console.log('✅ Full response:', response);

      const responseData = response?.data || response;
      const booking = responseData?.booking || responseData?.data?.booking;
      const bookingId = responseData?.bookingId || 
                       booking?.id || 
                       responseData?.data?.bookingId;

      console.log('✅ Booking ID:', bookingId);

      if (!bookingId) {
        console.error('❌ No booking ID in response:', response);
        toast.error('Booking created but ID not received.');
        navigate('/bookings');
        return;
      }

      localStorage.setItem('currentBookingId', bookingId);

      navigate('/booking/payment', {
        state: {
          ...bookingData,
          bookingId: bookingId,
          booking: booking,
          gatewayUrl: responseData?.gatewayUrl || null,
        },
      });

    } catch (error) {
      console.error('❌ Error:', error);
      
      // ✅ Proper error message extraction
      let errorMessage = 'Failed to create booking';
      
      if (error.response) {
        console.log('❌ Error response status:', error.response.status);
        console.log('❌ Error response data:', error.response.data);
        
        if (error.response.status === 409) {
          errorMessage = '🚫 This vehicle is already booked for the selected dates. Please choose different dates or another vehicle.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.errors) {
          errorMessage = error.response.data.errors.map(e => e.message).join(', ');
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'Failed to create booking';
      }
      
      // ✅ Show toast
      toast.error(errorMessage);
      
      // ✅ Show in UI
      setApiError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <BookingStepper currentStep={3} steps={bookingSteps} />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Review Your Booking</h1>
          <p className="text-slate-500">Please review before proceeding</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BookingSummary
            vehicle={vehicle}
            pickupDate={pickupDate}
            returnDate={returnDate}
            days={days}
          />

          <div className="space-y-4">
            <PriceBreakdown
              dailyRate={vehicle?.daily_rate || 0}
              days={days}
              rentalAmount={rentalAmount}
              depositAmount={vehicle?.deposit_amount || 0}
              totalAmount={totalAmount}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 mt-0.5"
              />
              <span className="text-sm text-slate-600">
                I agree to the Terms of Service and Rental Agreement
              </span>
            </label>

            <Button
              fullWidth
              size="lg"
              onClick={handleProceedToPayment}
              isLoading={isLoading}
            >
              {isLoading ? 'Creating Booking...' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;