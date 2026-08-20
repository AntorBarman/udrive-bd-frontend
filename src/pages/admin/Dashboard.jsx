import { Link } from 'react-router-dom';
import { 
  Users, 
  Car, 
  Calendar, 
  Wallet, 
  Shield,
  AlertCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import AdminStatCard from '../../components/dashboard/AdminStatCard';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { adminStats, pendingVehicles } from '../../mocks/adminData';

const AdminDashboard = () => {
  const stats = [
    { icon: Users, label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), change: 8, color: 'blue' },
    { icon: Car, label: 'Total Vehicles', value: adminStats.totalVehicles.toLocaleString(), change: 5, color: 'green' },
    { icon: Calendar, label: 'Total Bookings', value: adminStats.totalBookings.toLocaleString(), change: 12, color: 'purple' },
    { icon: Wallet, label: 'Total Revenue', value: `৳${(adminStats.totalRevenue / 100000).toFixed(1)}L`, change: 15, color: 'yellow' },
  ];
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
        <p className="text-slate-500">Platform overview and management</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Pending Approvals Alert */}
      {(adminStats.pendingVehicles > 0 || adminStats.pendingKYC > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">
              Pending Approvals
            </p>
            <p className="text-sm text-yellow-600">
              {adminStats.pendingVehicles} vehicles and {adminStats.pendingKYC} KYC documents awaiting review
            </p>
          </div>
          <Link
            to="/admin/vehicles/pending"
            className="text-sm text-yellow-700 font-medium hover:underline"
          >
            Review Now →
          </Link>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/admin/vehicles/pending" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Shield className="w-6 h-6 text-yellow-600 mb-2" />
          <p className="font-medium text-slate-900">Vehicle Approval</p>
          <p className="text-xs text-slate-500">{adminStats.pendingVehicles} pending</p>
        </Link>
        <Link to="/admin/kyc" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Users className="w-6 h-6 text-blue-600 mb-2" />
          <p className="font-medium text-slate-900">KYC Review</p>
          <p className="text-xs text-slate-500">{adminStats.pendingKYC} pending</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Calendar className="w-6 h-6 text-green-600 mb-2" />
          <p className="font-medium text-slate-900">Active Bookings</p>
          <p className="text-xs text-slate-500">{adminStats.activeBookings} ongoing</p>
        </Link>
        <Link to="/admin/payments" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Wallet className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-medium text-slate-900">Commission</p>
          <p className="text-xs text-slate-500">৳{adminStats.commissionEarned.toLocaleString()}</p>
        </Link>
      </div>
      
      {/* Pending Vehicles Preview */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Pending Vehicle Approvals</h2>
          <Link to="/admin/vehicles/pending" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <Card className="p-0 divide-y divide-slate-100">
          {pendingVehicles.slice(0, 3).map((vehicle) => (
            <div key={vehicle.id} className="p-4 flex items-center gap-4">
              <img
                src={vehicle.image_url}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-16 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </p>
                <p className="text-sm text-slate-500">
                  {vehicle.owner_name} • {vehicle.owner_phone}
                </p>
                <p className="text-xs text-slate-400">
                  Submitted: {vehicle.submitted_at}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  ৳{vehicle.daily_rate.toLocaleString()}/day
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
      </div>
      
      {/* Platform Revenue */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100 mb-1">Platform Commission Earned</p>
            <p className="text-3xl font-bold">
              ৳{adminStats.commissionEarned.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="success">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% this month
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;