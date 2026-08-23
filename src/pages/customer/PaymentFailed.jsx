import { useSearchParams, Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment was declined by the gateway.';
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Failed</h1>
        <p className="text-slate-500">We couldn't complete your payment.</p>
      </div>
      
      <Card className="p-5 mb-4">
        <p className="text-sm text-slate-600 text-center">{reason}</p>
      </Card>
      
      <div className="flex gap-3">
        <Link to="/bookings" className="flex-1">
          <Button fullWidth>Try Again</Button>
        </Link>
        <Link to="/dashboard" className="flex-1">
          <Button fullWidth variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;