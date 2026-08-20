import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal } from 'lucide-react';
import { fetchVehicles } from '../../features/vehicles/vehicleSlice';
import VehicleCard from '../../components/vehicle/VehicleCard';
import FilterSidebar from '../../components/vehicle/FilterSidebar';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

const Vehicles = () => {
  const dispatch = useDispatch();
  const { vehicles, isLoading, error, pagination } = useSelector((state) => state.vehicles);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  
  useEffect(() => {
    dispatch(fetchVehicles(filters));
  }, [dispatch, filters]);
  
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'desc',
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Available Vehicles</h1>
        <p className="text-slate-500">Find the perfect car for your journey</p>
      </div>
      
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFiltersOpen(true)}
        className="lg:hidden w-full bg-white border border-slate-200 rounded-lg py-2.5 mb-4 flex items-center justify-center gap-2 text-sm font-medium"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
      
      <div className="flex gap-6">
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
        />
        
        {/* Results */}
        <div className="flex-1">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <Skeleton variant="image" className="mb-3" />
                  <Skeleton variant="title" className="mb-2" />
                  <Skeleton variant="text" />
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && error && (
            <ErrorState
              title="Failed to Load Vehicles"
              message={error}
              onRetry={() => dispatch(fetchVehicles(filters))}
            />
          )}
          
          {!isLoading && !error && vehicles.length === 0 && (
            <EmptyState
              title="No Vehicles Found"
              description="Try adjusting your filters."
              action={
                <button onClick={clearFilters} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Clear Filters
                </button>
              }
            />
          )}
          
          {!isLoading && !error && vehicles.length > 0 && (
            <>
              <p className="text-sm text-slate-500 mb-4">
                {pagination.total} vehicles found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;