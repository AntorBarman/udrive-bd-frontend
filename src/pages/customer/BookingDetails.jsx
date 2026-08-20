import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  Car,
  CreditCard,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingById, cancelBooking } from '../../features/bookings/bookingSlice';
import paymentService from '../../services/paymentService';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatCurrency, formatDate, formatStatus } from '../../utils/formatters';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentBooking, isLoading, error: sliceError } = useSelector((state) => state.bookings);
  
  const [imgError, setImgError] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  
  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
  }, [dispatch, id]);
  
  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancelLoading(true);
    setActionError('');
    
    try {
      await dispatch(cancelBooking({ 
        id, 
        reason: 'Cancelled by customer' 
      })).unwrap();
      
      alert('Booking cancelled successfully');
      // Refresh booking data
      dispatch(fetchBookingById(id));
    } catch (error) {
      const message = typeof error === 'string' ? error : 'Cancellation failed';
      setActionError(message);
      alert(message);
    } finally {
      setCancelLoading(false);
    }
  };
  
  const handlePayNow = async () => {
    setPaymentLoading(true);
    setActionError('');
    
    try {
      const response = await paymentService.initiate(id);
      const { gatewayUrl } = response.data || response;
      
      if (gatewayUrl) {
        window.location.href = gatewayUrl;
      } else {
        setActionError('Payment gateway URL not found');
        alert('Payment gateway URL not found');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Payment initiation failed';
      setActionError(message);
      alert(message);
    } finally {
      setPaymentLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (sliceError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState
          title="Failed to Load Booking"
          message={sliceError}
          onRetry={() => dispatch(fetchBookingById(id))}
        />
      </div>
    );
  }
  
  if (!currentBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Not Found</h2>
        <Link to="/bookings" className="text-blue-600 hover:underline">
          ← Back to Bookings
        </Link>
      </div>
    );
  }
  
  const booking = currentBooking;
  const vehicleImage = booking.vehicle_image || booking.primary_image;
  const vehicleName = booking.brand === booking.model 
    ? `${booking.brand} ${booking.year}` 
    : `${booking.brand} ${booking.model} ${booking.year}`;
  
  const getStatusVariant = (status) => {
    const variants = {
      'pending_payment': 'warning',
      'confirmed': 'success',
      'ongoing': 'primary',
      'completed': 'default',
      'cancelled': 'danger',
      'expired': 'default',
    };
    return variants[status] || 'default';
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/bookings')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Bookings
      </button>
      
      {/* Action Error */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{actionError}</p>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Booking Details</h1>
          <p className="text-sm text-slate-500">Booking ID: {booking.id?.slice(0, 8)}</p>
        </div>
        <Badge variant={getStatusVariant(booking.status)}>
          {formatStatus(booking.status)}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Vehicle Card */}
          <Card className="flex items-center gap-4">
            <div className="w-32 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
              {!imgError && vehicleImage ? (
                <img
                  src={vehicleImage}
                  alt={vehicleName}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Car className="w-10 h-10" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900">{vehicleName}</h3>
              <p className="text-sm text-slate-500 capitalize">
                {booking.vehicle_type} • {booking.transmission} • {booking.fuel_type}
              </p>
            </div>
          </Card>
          
          {/* Dates */}
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Trip Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Pickup Date</p>
                <p className="font-medium text-slate-900">{formatDate(booking.pickup_date)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Return Date</p>
                <p className="font-medium text-slate-900">{formatDate(booking.return_date)}</p>
              </div>
            </div>
          </Card>
          
          {/* Price */}
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Rental Amount</span>
                <span className="text-slate-900 font-medium">{formatCurrency(booking.rental_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Security Deposit</span>
                <span className="text-slate-900 font-medium">{formatCurrency(booking.deposit_amount_snapshot)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="text-slate-900 font-semibold">Total</span>
                <span className="text-xl font-bold text-slate-900">{formatCurrency(booking.total_amount)}</span>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
            
            {booking.status === 'pending_payment' && (
              <Button
                fullWidth
                variant="primary"
                onClick={handlePayNow}
                isLoading={paymentLoading}
              >
                💳 Pay Now
              </Button>
            )}
            
            {(booking.status === 'pending_payment' || booking.status === 'confirmed') && (
              <Button
                fullWidth
                variant="danger"
                onClick={handleCancel}
                isLoading={cancelLoading}
                className="mt-2"
              >
                Cancel Booking
              </Button>
            )}
            
            <Link to="/vehicles" className="block mt-2">
              <Button fullWidth variant="outline">
                Browse More Cars
              </Button>
            </Link>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">Secure Booking</p>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Payment protected with SSLCommerz
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;