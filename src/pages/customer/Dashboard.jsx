import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  Wallet, 
  Clock, 
  ChevronRight,
  Search,
  User,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import bookingService from '../../services/bookingService';
import walletService from '../../services/walletService';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CustomerDashboard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  
  const [bookings, setBookings] = useState([]);
  const [balance, setBalance] = useState(null);
  const [kycApproved, setKycApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchDashboardData = useCallback(async () => {
    if (!accessToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch bookings
      const bookingsResponse = await bookingService.getMyBookings({ page: 1, limit: 20 });
      setBookings(bookingsResponse.data || []);
      
      // Fetch wallet
      try {
        const balanceResponse = await walletService.getBalance();
        setBalance(balanceResponse.data || balanceResponse);
      } catch (walletError) {
        console.warn('Wallet not available:', walletError.message);
        setBalance({ currentBalance: 0 });
      }
      
      // Check KYC
      try {
        const kycResponse = await api.get('/documents/my');
        const docs = kycResponse.data.data || [];
        const approvedCount = docs.filter((d) => d.status === 'approved').length;
        setKycApproved(approvedCount >= 2);
      } catch (kycError) {
        setKycApproved(false);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message={error}
        onRetry={fetchDashboardData}
      />
    );
  }
  
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending_payment');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const walletBalance = balance?.currentBalance || balance?.balance || 0;
  
  const stats = [
    { icon: Calendar, label: 'Total Bookings', value: totalBookings, color: 'blue' },
    { icon: Clock, label: 'Upcoming Trips', value: upcomingBookings.length, color: 'green' },
    { icon: Car, label: 'Completed Trips', value: completedBookings.length, color: 'purple' },
    { icon: Wallet, label: 'Wallet Balance', value: formatCurrency(walletBalance), color: 'yellow' },
  ];
  
  const getStatusVariant = (status) => {
    const variants = {
      'pending_payment': 'warning',
      'confirmed': 'success',
      'ongoing': 'primary',
      'completed': 'default',
      'cancelled': 'danger',
    };
    return variants[status] || 'default';
  };
  
  return (
    <div>
      {/* KYC Alert */}
      {!kycApproved && (
        <Link 
          to="/kyc" 
          className="block mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 hover:bg-yellow-100 transition-colors"
        >
          <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">Complete KYC Verification</p>
            <p className="text-sm text-yellow-600">
              Upload your NID and Driving License to book vehicles.
            </p>
          </div>
          <Shield className="w-5 h-5 text-yellow-600 shrink-0" />
        </Link>
      )}
      
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500">Here's what's happening with your bookings.</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/vehicles" className="bg-blue-600 text-white rounded-xl p-4 hover:bg-blue-700 transition-colors">
          <Search className="w-6 h-6 mb-2" />
          <p className="font-medium">Search Cars</p>
          <p className="text-xs text-blue-200">Find your next ride</p>
        </Link>
        
        <Link to="/bookings" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Calendar className="w-6 h-6 text-blue-600 mb-2" />
          <p className="font-medium text-slate-900">My Bookings</p>
          <p className="text-xs text-slate-500">{totalBookings} total</p>
        </Link>
        
        <Link to="/wallet" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Wallet className="w-6 h-6 text-green-600 mb-2" />
          <p className="font-medium text-slate-900">Wallet</p>
          <p className="text-xs text-slate-500">{formatCurrency(walletBalance)}</p>
        </Link>
        
        <Link to="/profile" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <User className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-medium text-slate-900">Profile</p>
          <p className="text-xs text-slate-500">Update info</p>
        </Link>
      </div>
      
      {/* Upcoming Bookings */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Bookings</h2>
          <Link to="/bookings" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <Card key={booking.id} hoverable className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {booking.brand === booking.model
                      ? `${booking.brand} ${booking.year}`
                      : `${booking.brand} ${booking.model} ${booking.year}`}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {formatDate(booking.pickup_date)} → {formatDate(booking.return_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(booking.total_amount)}</p>
                  <Badge variant={getStatusVariant(booking.status)} size="sm">
                    {booking.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-slate-500 text-center py-8">No upcoming bookings</p>
          </Card>
        )}
      </div>
      
      {/* Recent Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Bookings</h2>
        
        {bookings.length > 0 ? (
          <Card className="divide-y divide-slate-100 p-0">
            {bookings.slice(0, 5).map((booking) => (
              <Link
                key={booking.id}
                to={`/bookings/${booking.id}`}
                className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {booking.brand === booking.model
                      ? `${booking.brand} ${booking.year}`
                      : `${booking.brand} ${booking.model} ${booking.year}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(booking.pickup_date)} → {formatDate(booking.return_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(booking.total_amount)}</p>
                  <Badge variant={getStatusVariant(booking.status)} size="sm">
                    {booking.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </Link>
            ))}
          </Card>
        ) : (
          <EmptyState
            title="No Bookings Yet"
            description="Start by browsing available vehicles."
            action={
              <Link to="/vehicles">
                <Button>
                  <Search className="w-4 h-4" />
                  Browse Cars
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;