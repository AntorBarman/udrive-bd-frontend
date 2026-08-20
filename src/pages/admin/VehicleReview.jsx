import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  User,
  Car,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { pendingVehicles } from '../../mocks/adminData';

const VehicleReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const vehicle = pendingVehicles.find((v) => v.id === id) || pendingVehicles[0];
  
  const handleApprove = () => {
    alert('Vehicle approved successfully!');
    navigate('/admin/vehicles');
  };
  
  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    alert('Vehicle rejected');
    navigate('/admin/vehicles');
  };
  
  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-blue-600 mb-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Review Vehicle</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card className="overflow-hidden p-0">
            <img
              src={vehicle.image_url}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-64 object-cover"
            />
          </Card>
          
          {/* Basic Info */}
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
                <p className="font-medium">৳{vehicle.daily_rate.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          {/* Owner Info */}
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Owner Information
            </h2>
            <p className="font-medium text-slate-900">{vehicle.owner_name}</p>
            <p className="text-sm text-slate-500">{vehicle.owner_phone}</p>
          </Card>
          
          {/* Documents */}
          <Card>
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Submitted Documents
            </h2>
            <div className="flex flex-wrap gap-3">
              {vehicle.documents.map((doc) => (
                <Badge key={doc} variant="primary">
                  <FileText className="w-3 h-3 mr-1" />
                  {doc}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-900 mb-4">Approval Actions</h3>
            
            <div className="space-y-3">
              <Button fullWidth variant="success" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4" />
                Approve Vehicle
              </Button>
              
              <Button fullWidth variant="danger" onClick={() => setRejectModal(true)}>
                <XCircle className="w-4 h-4" />
                Reject Vehicle
              </Button>
              
              <Button fullWidth variant="outline">
                <AlertCircle className="w-4 h-4" />
                Request More Info
              </Button>
            </div>
          </Card>
          
          {/* Verification Status */}
          <Card>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Verification
            </h3>
            <p className="text-sm text-slate-500">
              All documents verified. Vehicle ready for approval.
            </p>
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
              placeholder="Please provide a reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" fullWidth onClick={handleReject}>
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