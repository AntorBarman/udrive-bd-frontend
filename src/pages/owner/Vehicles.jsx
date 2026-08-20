import { Link } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import VehicleStatusTable from '../../components/dashboard/VehicleStatusTable';
import EmptyState from '../../components/ui/EmptyState';
import { ownerVehicles } from '../../mocks/ownerData';

const OwnerVehicles = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Vehicles</h1>
          <p className="text-slate-500">Manage your vehicle fleet</p>
        </div>
        
        <Link to="/owner/vehicles/new" className="mt-4 sm:mt-0">
          <Button>
            <Plus className="w-4 h-4" />
            Add New Vehicle
          </Button>
        </Link>
      </div>
      
      {ownerVehicles.length > 0 ? (
        <VehicleStatusTable vehicles={ownerVehicles} />
      ) : (
        <EmptyState
          title="No Vehicles Yet"
          description="Start earning by adding your first vehicle to UDrive."
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
  );
};

export default OwnerVehicles;