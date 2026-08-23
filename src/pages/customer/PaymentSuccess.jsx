import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, Car, Download } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const transactionId = searchParams.get('tran_id');
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Successful</h1>
        <p className="text-slate-500">Your booking has been confirmed.</p>
      </div>
      
      <Card className="p-5 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Booking ID</span>
            <span className="font-mono">{bookingId?.slice(0, 8) || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono">{transactionId || 'N/A'}</span>
          </div>
        </div>
      </Card>
      
      <div className="flex gap-3">
        <Link to="/bookings" className="flex-1">
          <Button fullWidth>View Booking</Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button fullWidth variant="outline">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;