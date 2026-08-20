import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';

const AdminVehicles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const vehicles = [
    { id: '1', brand: 'Toyota', model: 'Corolla', year: 2022, owner: 'Rahim Ahmed', status: 'approved', daily_rate: 3500 },
    { id: '2', brand: 'Honda', model: 'Civic', year: 2021, owner: 'Karim Hossain', status: 'approved', daily_rate: 4000 },
    { id: '3', brand: 'Hyundai', model: 'Tucson', year: 2023, owner: 'Nusrat Jahan', status: 'pending', daily_rate: 5500 },
    { id: '4', brand: 'Suzuki', model: 'Swift', year: 2021, owner: 'Tanvir Islam', status: 'suspended', daily_rate: 2500 },
  ];
  
  const getStatusBadge = (status) => {
    const config = {
      approved: { variant: 'success', label: 'Approved' },
      pending: { variant: 'warning', label: 'Pending' },
      rejected: { variant: 'danger', label: 'Rejected' },
      suspended: { variant: 'danger', label: 'Suspended' },
    };
    return config[status] || { variant: 'default', label: status };
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Vehicle Management</h1>
        <p className="text-slate-500">Approve, reject, and manage all vehicles</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search vehicles..."
              icon={Search}
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
          </select>
        </div>
      </div>
      
      {/* Vehicles Table */}
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
              {vehicles.map((vehicle) => {
                const statusConfig = getStatusBadge(vehicle.status);
                return (
                  <tr key={vehicle.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {vehicle.brand} {vehicle.model} {vehicle.year}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{vehicle.owner}</td>
                    <td className="px-6 py-4">৳{vehicle.daily_rate.toLocaleString()}/day</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminVehicles;