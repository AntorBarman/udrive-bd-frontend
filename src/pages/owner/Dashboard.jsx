import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  Car, 
  Calendar, 
  Plus,
  ChevronRight,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import RevenueCard from '../../components/dashboard/RevenueCard';
import VehicleStatusTable from '../../components/dashboard/VehicleStatusTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import vehicleService from '../../services/vehicleService';
import bookingService from '../../services/bookingService';
import walletService from '../../services/walletService';
import { formatCurrency } from '../../utils/formatters';

const OwnerDashboard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchOwnerData = useCallback(async () => {
    if (!accessToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch vehicles
      const vehiclesResponse = await vehicleService.getMyVehicles();
      const vehicleList = vehiclesResponse.data || [];
      setVehicles(vehicleList);
      console.log('✅ Vehicles loaded:', vehicleList.length);
      
      // Fetch bookings
      try {
        const bookingsResponse = await bookingService.getOwnerBookings();
        const bookingList = bookingsResponse.data || [];
        setBookings(bookingList);
        console.log('✅ Bookings loaded:', bookingList.length);
      } catch (bookingError) {
        console.warn('⚠️ Failed to load bookings:', bookingError.message);
        setBookings([]);
      }
      
      // Fetch wallet balance
      try {
        const balanceResponse = await walletService.getBalance();
        setBalance(balanceResponse.data || balanceResponse);
        console.log('✅ Balance loaded:', balanceResponse.data);
      } catch (walletError) {
        console.warn('⚠️ Failed to load balance:', walletError.message);
        setBalance({ currentBalance: 0, totalCredit: 0, totalDebit: 0 });
      }
    } catch (error) {
      console.error('❌ Failed to fetch owner data:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError(error.response?.data?.message || 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken]);
  
  useEffect(() => {
    fetchOwnerData();
  }, [fetchOwnerData]);
  
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
        onRetry={fetchOwnerData}
      />
    );
  }
  
  // Calculate stats
  const availableVehicles = vehicles.filter(
    (v) => v.status === 'approved' || v.status === 'available'
  ).length;
  
  const bookedVehicles = vehicles.filter(
    (v) => v.status === 'booked' || v.status === 'unavailable'
  ).length;
  
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;
  const totalRevenue = balance?.totalCredit || 0;
  
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      subtitle: 'All time earnings',
      icon: Wallet,
      color: 'green',
    },
    {
      title: 'Available Vehicles',
      value: availableVehicles,
      subtitle: `${bookedVehicles} currently booked`,
      icon: Car,
      color: 'blue',
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      subtitle: `${completedBookings} completed`,
      icon: Calendar,
      color: 'purple',
    },
  ];
  
  return (
    <div>
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Owner Dashboard
          </h1>
          <p className="text-slate-500">
            Welcome back, {user?.name || 'Owner'}! Manage your fleet and earnings.
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Link to="/owner/vehicles">
            <Button variant="outline">
              <Car className="w-4 h-4" />
              Manage Vehicles
            </Button>
          </Link>
          <Link to="/owner/vehicles/new">
            <Button>
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <RevenueCard key={stat.title} {...stat} />
        ))}
      </div>
      
      {/* My Vehicles */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">My Vehicles</h2>
          <Link to="/owner/vehicles" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {vehicles.length > 0 ? (
          <VehicleStatusTable vehicles={vehicles} />
        ) : (
          <EmptyState
            title="No Vehicles Yet"
            description="Start earning by adding your first vehicle."
            action={
              <Link to="/owner/vehicles/new">
                <Button>
                  <Plus className="w-4 h-4" />
                  Add Your First Vehicle
                </Button>
              </Link>
            }
          />
        )}
      </div>
      
      {/* Recent Bookings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
        </div>
        
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} hoverable className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {booking.brand === booking.model
                      ? `${booking.brand} ${booking.year}`
                      : `${booking.brand} ${booking.model} ${booking.year}`}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {booking.customer_name || 'Customer'} • {booking.customer_phone || 'N/A'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(booking.pickup_date).toLocaleDateString()} → {new Date(booking.return_date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(booking.total_amount)}
                  </p>
                  <Badge
                    variant={
                      booking.status === 'completed' ? 'success' :
                      booking.status === 'ongoing' ? 'primary' : 'warning'
                    }
                    size="sm"
                  >
                    {booking.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Bookings Yet"
            description="Your vehicle bookings will appear here."
          />
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;