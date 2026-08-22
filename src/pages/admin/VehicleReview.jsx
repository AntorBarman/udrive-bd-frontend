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
  Camera,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import adminService from '../../services/adminService';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const VehicleReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  
  const [vehicle, setVehicle] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [vehicleDocuments, setVehicleDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  useEffect(() => {
    if (accessToken && id) {
      fetchVehicleData();
    }
  }, [accessToken, id]);
  
  const fetchVehicleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch vehicle details
      const vehicleResponse = await api.get(`/vehicles/${id}`);
      const vehicleData = vehicleResponse.data.data || vehicleResponse.data;
      setVehicle(vehicleData);
      
      // Fetch vehicle images
      if (vehicleData.images) {
        setVehicleImages(vehicleData.images);
      }
      
      // Fetch vehicle documents
      try {
        const docsResponse = await api.get(`/admin/kyc`);
        const allDocs = docsResponse.data.data || [];
        const vehicleDocs = allDocs.filter((d) => 
          d.vehicle_id === id || 
          ['vehicle_rc', 'insurance', 'tax_token', 'vehicle_photo'].includes(d.document_type)
        );
        setVehicleDocuments(vehicleDocs);
      } catch (docError) {
        console.warn('Failed to fetch vehicle docs:', docError);
        setVehicleDocuments([]);
      }
      
      console.log('✅ Vehicle data loaded');
    } catch (error) {
      console.error('❌ Failed to fetch vehicle:', error);
      setError(error.response?.data?.message || 'Failed to load vehicle');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async () => {
    if (!confirm('Approve this vehicle? It will be visible to customers.')) return;
    
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
      alert('Please provide rejection reason');
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
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }
  
  if (error) {
    return <ErrorState title="Failed to Load Vehicle" message={error} onRetry={fetchVehicleData} />;
  }
  
  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Vehicle Not Found</h2>
        <button onClick={() => navigate('/admin/vehicles')} className="text-blue-600 hover:underline">
          ← Back
        </button>
      </div>
    );
  }
  
  const getDocStatusConfig = (status) => {
    const configs = {
      approved: { variant: 'success', icon: CheckCircle, label: 'Verified' },
      pending: { variant: 'warning', icon: Clock, label: 'Pending' },
      rejected: { variant: 'danger', icon: XCircle, label: 'Rejected' },
    };
    return configs[status] || configs.pending;
  };
  
  return (
    <div>
      {/* Back */}
      <button onClick={() => navigate('/admin/vehicles')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-4">
        <ChevronLeft className="w-4 h-4" />
        Back to Vehicles
      </button>
      
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Vehicle Review</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Info */}
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-600" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                <p className="text-xs text-slate-500">Type</p>
                <p className="font-medium capitalize">{vehicle.vehicle_type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Daily Rate</p>
                <p className="font-medium">৳{Number(vehicle.daily_rate).toLocaleString()}</p>
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
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Owner Information
            </h2>
            <p className="font-medium">{vehicle.owner_name || 'N/A'}</p>
            <p className="text-sm text-slate-500">{vehicle.owner_phone}</p>
            <p className="text-sm text-slate-500">{vehicle.owner_email}</p>
          </Card>
          
          {/* Vehicle Photos */}
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Vehicle Photos ({vehicleImages.length} uploaded)
            </h2>
            
            {vehicleImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {vehicleImages.map((img, index) => (
                  <div key={img.id || index} className="relative rounded-lg overflow-hidden">
                    <img
                      src={img.image_url || img.url}
                      alt={`Vehicle photo ${index + 1}`}
                      className="w-full h-40 object-cover"
                      crossOrigin="anonymous"
                    />
                    {img.is_primary && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No photos uploaded</p>
            )}
          </Card>
          
          {/* Vehicle Documents */}
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Vehicle Documents
            </h2>
            
            {vehicleDocuments.length > 0 ? (
              <div className="space-y-3">
                {vehicleDocuments.map((doc) => {
                  const statusConfig = getDocStatusConfig(doc.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <FileText className="w-5 h-5 text-slate-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {doc.document_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </p>
                        <p className="text-xs text-slate-500">
                          Uploaded: {formatDate(doc.created_at)}
                        </p>
                      </div>
                      <Badge variant={statusConfig.variant} size="sm">
                        {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                        {statusConfig.label}
                      </Badge>
                      {doc.document_url && doc.document_url !== doc.document_url.includes('originalname') && (
                        <a 
                          href={doc.document_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-600 hover:underline shrink-0"
                        >
                          View
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No documents submitted</p>
            )}
          </Card>
        </div>
        
        {/* Actions Sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4">Approval Actions</h3>
            
            <div className="space-y-3">
              {vehicle.status !== 'approved' && (
                <Button fullWidth variant="success" onClick={handleApprove} isLoading={actionLoading}>
                  <Check className="w-4 h-4" />
                  Approve Vehicle
                </Button>
              )}
              
              {vehicle.status !== 'rejected' && (
                <Button fullWidth variant="danger" onClick={() => setRejectModal(true)}>
                  <X className="w-4 h-4" />
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
          
          {/* Review Checklist */}
          <Card className="bg-yellow-50 border-yellow-200">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-600" />
              Review Checklist
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" /> Vehicle photos clear
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" /> Registration valid
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" /> Insurance current
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" /> Owner KYC verified
              </li>
            </ul>
          </Card>
        </div>
      </div>
      
      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRejectModal(false)} />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold text-slate-900 mb-4">Reject Vehicle</h3>
            <textarea
              rows="4"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm mb-4"
            />
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setRejectModal(false)}>Cancel</Button>
              <Button variant="danger" fullWidth onClick={handleReject} isLoading={actionLoading}>Confirm Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleReview;