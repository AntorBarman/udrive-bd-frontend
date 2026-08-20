import { Link } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  Wallet, 
  Clock, 
  ChevronRight,
  Plus,
  Search,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  // Mock data
  const stats = [
    { icon: Calendar, label: 'Total Bookings', value: '12', change: 8, color: 'blue' },
    { icon: Clock, label: 'Upcoming Trips', value: '2', change: null, color: 'green' },
    { icon: Car, label: 'Completed Trips', value: '10', change: 15, color: 'purple' },
    { icon: Wallet, label: 'Wallet Balance', value: '৳2,500', change: null, color: 'yellow' },
  ];
  
  const upcomingBookings = [
    {
      id: 'b1',
      vehicle: 'Toyota Corolla 2022',
      pickup_date: '2026-08-25',
      return_date: '2026-08-28',
      total_amount: 15000,
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&h=80&fit=crop',
    },
    {
      id: 'b2',
      vehicle: 'Honda Civic 2021',
      pickup_date: '2026-09-05',
      return_date: '2026-09-07',
      total_amount: 12000,
      status: 'pending_payment',
      image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=100&h=80&fit=crop',
    },
  ];
  
  const recentActivities = [
    { id: 'a1', text: 'Booking confirmed for Toyota Corolla', date: '2 hours ago', type: 'booking' },
    { id: 'a2', text: 'Payment received ৳15,000', date: '2 hours ago', type: 'payment' },
    { id: 'a3', text: 'Reviewed Honda Civic', date: '1 day ago', type: 'review' },
    { id: 'a4', text: 'Added security deposit ৳7,000', date: '3 days ago', type: 'deposit' },
  ];
  
  return (
    <div>
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
          <p className="text-xs text-slate-500">View all trips</p>
        </Link>
        
        <Link to="/wallet" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Wallet className="w-6 h-6 text-green-600 mb-2" />
          <p className="font-medium text-slate-900">Wallet</p>
          <p className="text-xs text-slate-500">Balance & transactions</p>
        </Link>
        
        <Link to="/profile" className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
          <Plus className="w-6 h-6 text-purple-600 mb-2" />
          <p className="font-medium text-slate-900">Profile</p>
          <p className="text-xs text-slate-500">Update information</p>
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
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} hoverable className="flex items-center gap-4">
                <img
                  src={booking.image}
                  alt={booking.vehicle}
                  className="w-24 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{booking.vehicle}</h3>
                  <p className="text-sm text-slate-500">
                    {booking.pickup_date} → {booking.return_date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">৳{booking.total_amount.toLocaleString()}</p>
                  <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                    {booking.status.replace('_', ' ')}
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
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <Card className="divide-y divide-slate-100">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="py-3 flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <p className="flex-1 text-sm text-slate-700">{activity.text}</p>
              <span className="text-xs text-slate-400">{activity.date}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;