import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  Car, 
  Calendar, 
  Clock, 
  Star, 
  Plus,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import RevenueCard from '../../components/dashboard/RevenueCard';
import VehicleStatusTable from '../../components/dashboard/VehicleStatusTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { ownerStats, ownerVehicles, ownerRecentBookings, monthlyRevenue } from '../../mocks/ownerData';

const OwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  const stats = [
    {
      title: 'Total Revenue',
      value: `৳${ownerStats.totalRevenue.toLocaleString()}`,
      subtitle: 'All time earnings',
      change: 12,
      icon: Wallet,
      color: 'green',
    },
    {
      title: 'Available Vehicles',
      value: ownerStats.availableVehicles,
      subtitle: `${ownerStats.bookedVehicles} currently booked`,
      icon: Car,
      color: 'blue',
    },
    {
      title: 'Total Bookings',
      value: ownerStats.totalBookings,
      subtitle: `${ownerStats.completedTrips} completed`,
      icon: Calendar,
      color: 'purple',
    },
    {
      title: 'Average Rating',
      value: ownerStats.averageRating,
      subtitle: `${ownerStats.responseRate} response rate`,
      icon: Star,
      color: 'yellow',
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
      
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <RevenueCard key={stat.title} {...stat} />
        ))}
      </div>
      
      {/* Revenue Chart (Simple) */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Revenue Overview</h2>
          <Badge variant="success">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% this month
          </Badge>
        </div>
        
        <div className="flex items-end gap-4 h-40">
          {monthlyRevenue.map((item) => {
            const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));
            const height = (item.revenue / maxRevenue) * 100;
            
            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  ৳{(item.revenue / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-slate-500">{item.month}</span>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* My Vehicles */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">My Vehicles</h2>
          <Link to="/owner/vehicles" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <VehicleStatusTable vehicles={ownerVehicles.slice(0, 3)} />
      </div>
      
      {/* Recent Bookings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
          <Link to="/owner/bookings" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {ownerRecentBookings.map((booking) => (
            <Card key={booking.id} hoverable className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{booking.vehicle}</h3>
                <p className="text-sm text-slate-500">
                  {booking.customer} • {booking.customer_phone}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {booking.pickup_date} → {booking.return_date}
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  ৳{booking.total_amount.toLocaleString()}
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
      </div>
    </div>
  );
};

export default OwnerDashboard;