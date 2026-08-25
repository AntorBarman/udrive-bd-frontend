import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CreditCard, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import DateSelector from './DateSelector';
import PriceBreakdown from '../vehicle/PriceBreakdown';
import api from '../../services/api';
import { toast } from 'react-toastify';

const BookingPanel = ({ vehicle }) => {
  const navigate = useNavigate();

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [compliance, setCompliance] = useState(null);
  const [isComplianceLoading, setIsComplianceLoading] = useState(true);

  const dailyRate = Number(vehicle.daily_rate) || 0;
  const depositAmount = Number(vehicle.deposit_amount) || 0;

  // ✅ Check compliance on load
  useEffect(() => {
    checkCompliance();
  }, [vehicle.id]);

  // ✅ Check availability whenever dates change
  useEffect(() => {
    if (pickupDate && returnDate) {
      checkAvailability();
    } else {
      setIsAvailable(null);
      setAvailabilityMessage('');
    }
  }, [pickupDate, returnDate]);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;
    const pickup = new Date(pickupDate + 'T00:00:00');
    const returnD = new Date(returnDate + 'T00:00:00');
    const diffTime = Math.abs(returnD - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = calculateDays();
  const rentalAmount = days * dailyRate;
  const totalAmount = rentalAmount + depositAmount;

  // ✅ COMPLIANCE CHECK - Real
  const checkCompliance = async () => {
    setIsComplianceLoading(true);
    try {
      console.log('🔍 Checking compliance for vehicle:', vehicle.id);
      const response = await api.get(`/vehicles/${vehicle.id}/compliance`);
      console.log('✅ Compliance response:', response.data);
      
      setCompliance(response.data.data);
      
      // If not eligible, show warning
      if (!response.data.data.eligible) {
        toast.warning(`Vehicle not available: ${response.data.data.notes.join(', ')}`);
      }
    } catch (error) {
      console.error('❌ Compliance check failed:', error);
      // Don't block booking if compliance check fails (fallback)
    } finally {
      setIsComplianceLoading(false);
    }
  };

  // ✅ REAL AVAILABILITY CHECK
  const checkAvailability = async () => {
    if (!pickupDate || !returnDate) return;
    
    if (new Date(pickupDate) >= new Date(returnDate)) {
      setIsAvailable(false);
      setAvailabilityMessage('Return date must be after pickup date');
      return;
    }

    setIsLoading(true);
    setIsAvailable(null);

    try {
      console.log('🔍 Checking availability:', {
        vehicleId: vehicle.id,
        pickupDate,
        returnDate
      });

      const response = await api.get('/vehicles/check-availability', {
        params: {
          vehicleId: vehicle.id,
          pickupDate: pickupDate,
          returnDate: returnDate
        }
      });

      console.log('✅ Availability response:', response.data);

      const available = response.data.data.available;
      setIsAvailable(available);

      if (available) {
        setAvailabilityMessage('✅ This vehicle is available for your selected dates');
      } else {
        setAvailabilityMessage('❌ This vehicle is not available for the selected dates. Please choose different dates.');
      }

    } catch (error) {
      console.error('❌ Availability check failed:', error);
      setIsAvailable(false);
      setAvailabilityMessage('⚠️ Could not check availability. Please try again.');
      toast.error('Failed to check availability');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = () => {
    console.log('🔍 Reserve clicked:', { 
      pickupDate, 
      returnDate, 
      days,
      vehicleId: vehicle.id,
      isAvailable,
      compliance
    });
    
    if (!pickupDate) {
      setError('Please select pickup date');
      return;
    }

    if (!returnDate) {
      setError('Please select return date');
      return;
    }

    if (days <= 0) {
      setError('Return date must be after pickup date');
      return;
    }

    // ✅ Check compliance first
    if (compliance && !compliance.eligible) {
      setError(`This vehicle is not available for booking: ${compliance.notes.join(', ')}`);
      toast.error(`Vehicle blocked: ${compliance.notes.join(', ')}`);
      return;
    }

    // ✅ Check availability
    if (isAvailable === false) {
      setError('This vehicle is not available for the selected dates. Please choose different dates.');
      return;
    }

    if (isAvailable === null) {
      setError('Please wait for availability check');
      return;
    }

    setError('');
    
    navigate('/booking/confirm', {
      state: {
        vehicle: {
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          daily_rate: dailyRate,
          deposit_amount: depositAmount,
          primary_image: vehicle.primary_image || vehicle.images?.[0]?.image_url || null,
          images: vehicle.images || [],
          branch_name: vehicle.branch_name,
          vehicle_type: vehicle.vehicle_type,
          transmission: vehicle.transmission,
          fuel_type: vehicle.fuel_type,
          seats: vehicle.seats,
        },
        pickupDate,
        returnDate,
        days,
        rentalAmount,
        totalAmount,
      },
    });
  };

  // ✅ Check if vehicle can be reserved
  const canReserve = () => {
    if (isComplianceLoading) return false;
    if (compliance && !compliance.eligible) return false;
    if (isAvailable === false) return false;
    if (isLoading) return false;
    if (!pickupDate || !returnDate) return false;
    return true;
  };

  // ✅ Get button text
  const getButtonText = () => {
    if (isComplianceLoading) return 'Checking...';
    if (compliance && !compliance.eligible) return 'Not Available';
    if (isLoading) return 'Checking...';
    if (isAvailable === false) return 'Not Available';
    if (!pickupDate || !returnDate) return 'Select Dates';
    return 'Reserve Now';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="mb-4">
        <span className="text-3xl font-bold text-slate-900">
          ৳{dailyRate.toLocaleString('en-BD')}
        </span>
        <span className="text-slate-500"> / day</span>
      </div>

      <DateSelector
        pickupDate={pickupDate}
        returnDate={returnDate}
        onPickupChange={setPickupDate}
        onReturnChange={setReturnDate}
        error={error}
      />

      {/* ✅ Compliance Status Display */}
      {!isComplianceLoading && compliance && !compliance.eligible && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>⚠️ {compliance.notes.join(', ')}</span>
          </div>
        </div>
      )}

      {/* ✅ Availability Status Display */}
      {pickupDate && returnDate && isAvailable !== null && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          isLoading ? 'bg-yellow-50 text-yellow-700' :
          isAvailable === true ? 'bg-green-50 text-green-700' :
          'bg-red-50 text-red-700'
        }`}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
              Checking availability...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {availabilityMessage}
            </div>
          )}
        </div>
      )}

      {days > 0 && isAvailable === true && compliance?.eligible !== false && (
        <div className="mt-4">
          <PriceBreakdown
            dailyRate={dailyRate}
            depositAmount={depositAmount}
            days={days}
            rentalAmount={rentalAmount}
            totalAmount={totalAmount}
          />
        </div>
      )}

      <Button 
        fullWidth 
        size="lg" 
        onClick={handleReserve} 
        className="mt-4"
        disabled={!canReserve()}
      >
        {getButtonText()}
      </Button>

      <p className="text-center text-xs text-slate-400 mt-3">
        You won't be charged yet
      </p>

      <div className="border-t border-slate-200 mt-4 pt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-green-600" />
          {compliance?.eligible ? '✅ Verified Vehicle' : '⚠️ Compliance Check Pending'}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-green-600" />
          Secure KYC Verified
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CreditCard className="w-4 h-4 text-green-600" />
          SSLCommerz Payment
        </div>
      </div>
    </div>
  );
};

export default BookingPanel;