import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Car, 
  Calendar, 
  Wallet, 
  Shield,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import AdminStatCard from '../../components/dashboard/AdminStatCard';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  const [stats, setStats] = useState(null);
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (accessToken) {
      fetchAdminData();
    }
  }, [accessToken]);
  
  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch stats
      const statsResponse = await adminService.getStats();
      setStats(statsResponse.data || statsResponse);
      
      // Fetch pending vehicles
      const pendingResponse = await adminService.getPendingVehicles();
      setPendingVehicles(pendingResponse.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch admin data:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError(error.response?.data?.message || 'Failed to load admin dashboard');
      }
    } finally {
      setLoading(false);
    }
  };
  
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
        onRetry={fetchAdminData}
      />
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-slate-500">Platform overview and management</p>
      </div>
      
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AdminStatCard 
            icon={Users} 
            label="Total Users" 
            value={stats.totalUsers || 0} 
            color="blue" 
          />
          <AdminStatCard 
            icon={Car} 
            label="Total Vehicles" 
            value={stats.totalVehicles || 0} 
            color="green" 
          />
          <AdminStatCard 
            icon={Calendar} 
            label="Total Bookings" 
            value={stats.totalBookings || 0} 
            color="purple" 
          />
          <AdminStatCard 
            icon={Wallet} 
            label="Commission Earned" 
            value={`৳${(stats.commissionEarned || 0).toLocaleString()}`} 
            color="yellow" 
          />
        </div>
      )}
      
      {/* Pending Alert */}
      {(stats?.pendingVehicles > 0 || stats?.pendingKYC > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">Pending Approvals</p>
            <p className="text-sm text-yellow-600">
              {stats.pendingVehicles} vehicles awaiting review
            </p>
          </div>
          <Link to="/admin/vehicles" className="text-sm text-yellow-700 font-medium hover:underline">
            Review Now →
          </Link>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/admin/vehicles" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Shield className="w-6 h-6 text-yellow-600 mb-2" />
          <p className="font-medium text-slate-900">Vehicle Approval</p>
          <p className="text-xs text-slate-500">{stats?.pendingVehicles || 0} pending</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Calendar className="w-6 h-6 text-green-600 mb-2" />
          <p className="font-medium text-slate-900">Bookings</p>
          <p className="text-xs text-slate-500">{stats?.totalBookings || 0} total</p>
        </Link>
        <Link to="/admin/payments" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Wallet className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-medium text-slate-900">Payments</p>
          <p className="text-xs text-slate-500">View transactions</p>
        </Link>
        <Link to="/admin/users" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Users className="w-6 h-6 text-blue-600 mb-2" />
          <p className="font-medium text-slate-900">Users</p>
          <p className="text-xs text-slate-500">{stats?.totalUsers || 0} total</p>
        </Link>
      </div>
      
      {/* Pending Vehicles */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Pending Vehicle Approvals</h2>
          <Link to="/admin/vehicles" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {pendingVehicles.length > 0 ? (
          <Card className="p-0 divide-y divide-slate-100">
            {pendingVehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 flex items-center gap-4">
                {vehicle.primary_image && (
                  <img
                    src={vehicle.primary_image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-16 h-12 object-cover rounded-lg"
                    crossOrigin="anonymous"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {vehicle.brand === vehicle.model
                      ? `${vehicle.brand} ${vehicle.year}`
                      : `${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                  </p>
                  <p className="text-sm text-slate-500">
                    {vehicle.owner_name} • {vehicle.owner_phone}
                  </p>
                  <p className="text-xs text-slate-400">
                    Submitted: {new Date(vehicle.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    ৳{Number(vehicle.daily_rate).toLocaleString()}/day
                  </p>
                  <Link
                    to={`/admin/vehicles/${vehicle.id}/review`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Review →
                  </Link>
                </div>
              </div>
            ))}
          </Card>
        ) : (
          <Card>
            <p className="text-slate-500 text-center py-8">No pending vehicles</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;