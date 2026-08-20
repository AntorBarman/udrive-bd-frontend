import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import adminService from '../../services/adminService';

const AdminVehicles = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    if (accessToken) {
      fetchVehicles();
    }
  }, [accessToken]);
  
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getAllVehicles();
      setVehicles(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusVariant = (status) => {
    const variants = {
      'approved': 'success',
      'pending': 'warning',
      'rejected': 'danger',
      'suspended': 'danger',
      'available': 'success',
      'unavailable': 'danger',
    };
    return variants[status] || 'default';
  };
  
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = `${vehicle.brand} ${vehicle.model} ${vehicle.owner_name || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
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
        title="Failed to Load Vehicles"
        message={error}
        onRetry={fetchVehicles}
      />
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Vehicle Management</h1>
        <p className="text-slate-500">Approve, reject, and manage all vehicles</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicles or owners..."
              className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
            <option value="available">Available</option>
          </select>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {vehicle.brand === vehicle.model
                      ? `${vehicle.brand} ${vehicle.year}`
                      : `${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {vehicle.owner_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    ৳{Number(vehicle.daily_rate).toLocaleString()}/day
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusVariant(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/vehicles/${vehicle.id}/review`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredVehicles.length === 0 && (
          <p className="text-center py-8 text-slate-500">No vehicles found</p>
        )}
      </div>
    </div>
  );
};

export default AdminVehicles;