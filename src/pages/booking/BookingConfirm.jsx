import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import BookingStepper from '../../components/booking/BookingStepper';
import BookingSummary from '../../components/booking/BookingSummary';
import PriceBreakdown from '../../components/booking/PriceBreakdown';
import Button from '../../components/ui/Button';
import { bookingSteps, mockBookingVehicle } from '../../mocks/booking';
import bookingService from '../../services/bookingService';

const BookingConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const bookingData = location.state || {
    vehicle: mockBookingVehicle,
    pickupDate: '2026-08-25',
    returnDate: '2026-08-28',
    days: 3,
    rentalAmount: 10500,
    totalAmount: 17500,
  };

  const { vehicle, pickupDate, returnDate, days, rentalAmount, totalAmount } = bookingData;

  console.log('🔍 BookingConfirm data:', { pickupDate, returnDate, days });

  const handleProceedToPayment = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setApiError('');
    setIsLoading(true);

    try {
      // No frontend date validation - let backend handle
      const bookingPayload = {
        vehicle_id: vehicle.id,
        pickup_date: pickupDate,
        return_date: returnDate,
        pickup_time: '10:00',
        return_time: '10:00',
      };

      console.log('🔍 Sending to backend:', bookingPayload);

      const response = await bookingService.create(bookingPayload);
      console.log('✅ Success:', response);

      const createdBooking = response.data || response;

      navigate('/booking/payment', {
        state: {
          ...bookingData,
          bookingId: createdBooking.id,
          booking: createdBooking,
        },
      });
    } catch (error) {
      console.error('❌ Error:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to create booking';
      setApiError(message);
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
              dailyRate={vehicle.daily_rate}
              days={days}
              rentalAmount={rentalAmount}
              depositAmount={vehicle.deposit_amount}
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