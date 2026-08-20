import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CreditCard } from 'lucide-react';
import Button from '../ui/Button';
import DateSelector from './DateSelector';
import PriceBreakdown from '../vehicle/PriceBreakdown';

const BookingPanel = ({ vehicle }) => {
  const navigate = useNavigate();

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [error, setError] = useState('');

  const dailyRate = Number(vehicle.daily_rate) || 0;
  const depositAmount = Number(vehicle.deposit_amount) || 0;

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

  const handleReserve = () => {
    console.log('🔍 Reserve clicked:', { pickupDate, returnDate, days });
    
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

    setError('');
    
    navigate('/booking/confirm', {
      state: {
        vehicle: {
          ...vehicle,
          daily_rate: dailyRate,
          deposit_amount: depositAmount,
          primary_image: vehicle.primary_image || vehicle.images?.[0]?.image_url || null,
          images: vehicle.images || [],
        },
        pickupDate,
        returnDate,
        days,
        rentalAmount,
        totalAmount,
      },
    });
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

      {days > 0 && (
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

      <Button fullWidth size="lg" onClick={handleReserve} className="mt-4">
        Reserve Now
      </Button>

      <p className="text-center text-xs text-slate-400 mt-3">
        You won't be charged yet
      </p>

      <div className="border-t border-slate-200 mt-4 pt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-green-600" />
          Verified Vehicle
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