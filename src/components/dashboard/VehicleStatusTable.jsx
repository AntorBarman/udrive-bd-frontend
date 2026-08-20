import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import Badge from '../ui/Badge';
import VehicleStatusBadge from '../vehicle/VehicleStatusBadge';

const VehicleStatusTable = ({ vehicles }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Daily Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Bookings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={vehicle.image_url}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-slate-900">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">
                        {vehicle.year} • {vehicle.vehicle_type}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  ৳{vehicle.daily_rate.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {vehicle.total_bookings}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  ৳{vehicle.total_revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {vehicle.rating ? (
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      {vehicle.rating}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <VehicleStatusBadge status={vehicle.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/owner/vehicles/${vehicle.id}/edit`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/vehicles/${vehicle.id}`}
                      className="text-xs text-slate-500 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleStatusTable;