import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import VehicleStatusTable from '../../components/dashboard/VehicleStatusTable';
import EmptyState from '../../components/ui/EmptyState';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import vehicleService from '../../services/vehicleService';

const OwnerVehicles = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (accessToken) {
      fetchVehicles();
    }
  }, [accessToken]);
  
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await vehicleService.getMyVehicles();
      console.log('🔍 My vehicles:', response);
      setVehicles(response.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch vehicles:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError(error.response?.data?.message || 'Failed to load vehicles');
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
        title="Failed to Load Vehicles"
        message={error}
        onRetry={fetchVehicles}
      />
    );
  }
  
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
      
      {vehicles.length > 0 ? (
        <VehicleStatusTable vehicles={vehicles} />
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