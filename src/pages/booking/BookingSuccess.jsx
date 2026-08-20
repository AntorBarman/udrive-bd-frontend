import { useState, useEffect } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Download, Car, AlertCircle } from 'lucide-react';
import BookingStepper from '../../components/booking/BookingStepper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { bookingSteps } from '../../mocks/booking';
import bookingService from '../../services/bookingService';

const BookingSuccess = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);
  
  const tranId = searchParams.get('tran_id');
  const bookingId = searchParams.get('booking_id') || location.state?.bookingId;
  
  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId);
    } else if (tranId) {
      setLoading(false);
      setBooking({
        id: 'BK_' + Math.random().toString(36).slice(2, 10).toUpperCase(),
        transaction_id: tranId,
        status: 'confirmed',
      });
    } else {
      setLoading(false);
      setError('Booking information not found');
    }
  }, [bookingId, tranId]);
  
  const fetchBookingDetails = async (id) => {
    setLoading(true);
    try {
      const response = await bookingService.getById(id);
      setBooking(response.data || response);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      // Use location state as fallback
      if (location.state?.booking) {
        setBooking(location.state.booking);
      } else {
        setError('Failed to load booking details');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <BookingStepper currentStep={5} steps={bookingSteps} />
        
        {/* Error State */}
        {error ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Something Went Wrong</h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <Link to="/bookings">
              <Button>View My Bookings</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-slate-500">
                Your booking has been successfully confirmed.
              </p>
            </div>
            
            {/* Booking Details */}
            {booking && (
              <Card className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Booking ID</p>
                    <p className="font-mono text-sm font-medium text-slate-900">
                      {booking.id?.slice(0, 8) || bookingId?.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                    <p className="font-mono text-sm font-medium text-slate-900">
                      {tranId || booking.transaction_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      Confirmed
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Paid</p>
                    <p className="text-xl font-bold text-slate-900">
                      ৳{Number(booking.total_amount || 0).toLocaleString('en-BD')}
                    </p>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Actions */}
            <div className="flex gap-4">
              <Link to="/bookings" className="flex-1">
                <Button fullWidth variant="primary">
                  View My Bookings
                </Button>
              </Link>
              <Link to="/vehicles" className="flex-1">
                <Button fullWidth variant="outline">
                  Browse More Cars
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;