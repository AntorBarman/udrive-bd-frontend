import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  User,
  Car,
  ChevronLeft,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import adminService from '../../services/adminService';

const VehicleReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  useEffect(() => {
    if (accessToken && id) {
      fetchVehicle();
    }
  }, [accessToken, id]);
  
  const fetchVehicle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all vehicles and find this one
      const response = await adminService.getAllVehicles();
      const vehicles = response.data || [];
      const found = vehicles.find((v) => v.id === id);
      setVehicle(found || null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async () => {
    if (!confirm('Approve this vehicle?')) return;
    
    setActionLoading(true);
    try {
      await adminService.approveVehicle(id);
      alert('Vehicle approved successfully!');
      navigate('/admin/vehicles');
    } catch (error) {
      alert(error.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    setActionLoading(true);
    try {
      await adminService.rejectVehicle(id, rejectReason);
      alert('Vehicle rejected');
      navigate('/admin/vehicles');
    } catch (error) {
      alert(error.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleSuspend = async () => {
    if (!confirm('Suspend this vehicle?')) return;
    
    setActionLoading(true);
    try {
      await adminService.suspendVehicle(id);
      alert('Vehicle suspended');
      navigate('/admin/vehicles');
    } catch (error) {
      alert(error.response?.data?.message || 'Suspension failed');
    } finally {
      setActionLoading(false);
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
        title="Failed to Load Vehicle"
        message={error}
        onRetry={fetchVehicle}
      />
    );
  }
  
  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Vehicle Not Found</h2>
        <button onClick={() => navigate('/admin/vehicles')} className="text-blue-600 hover:underline">
          ← Back to Vehicles
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <button
        onClick={() => navigate('/admin/vehicles')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Review Vehicle</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          {vehicle.primary_image && (
            <Card className="overflow-hidden p-0">
              <img
                src={vehicle.primary_image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-64 object-cover"
                crossOrigin="anonymous"
              />
            </Card>
          )}
          
          {/* Vehicle Info */}
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Brand</p>
                <p className="font-medium">{vehicle.brand}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Model</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Year</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Daily Rate</p>
                <p className="font-medium">৳{Number(vehicle.daily_rate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Vehicle Type</p>
                <p className="font-medium capitalize">{vehicle.vehicle_type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <Badge variant={vehicle.status === 'approved' ? 'success' : vehicle.status === 'pending' ? 'warning' : 'danger'}>
                  {vehicle.status}
                </Badge>
              </div>
            </div>
          </Card>
          
          {/* Owner Info */}
          {vehicle.owner_name && (
            <Card>
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Owner Information
              </h2>
              <p className="font-medium text-slate-900">{vehicle.owner_name}</p>
              <p className="text-sm text-slate-500">{vehicle.owner_phone}</p>
              <p className="text-sm text-slate-500">{vehicle.owner_email}</p>
            </Card>
          )}
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4">Approval Actions</h3>
            
            <div className="space-y-3">
              {vehicle.status !== 'approved' && (
                <Button fullWidth variant="success" onClick={handleApprove} isLoading={actionLoading}>
                  <CheckCircle className="w-4 h-4" />
                  Approve Vehicle
                </Button>
              )}
              
              {vehicle.status !== 'rejected' && (
                <Button fullWidth variant="danger" onClick={() => setRejectModal(true)}>
                  <XCircle className="w-4 h-4" />
                  Reject Vehicle
                </Button>
              )}
              
              {vehicle.status === 'approved' && (
                <Button fullWidth variant="outline" onClick={handleSuspend}>
                  <AlertCircle className="w-4 h-4" />
                  Suspend Vehicle
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setRejectModal(false)} />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold text-slate-900 mb-4">Rejection Reason</h3>
            <textarea
              rows="4"
              className="w-full border border-slate-200 rounded-lg p-3 text-sm mb-4"
              placeholder="Why are you rejecting this vehicle?"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" fullWidth onClick={handleReject} isLoading={actionLoading}>
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleReview;