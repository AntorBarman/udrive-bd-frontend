import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  XCircle,
  Shield,
  User,
  Car,
  Camera,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const CustomerKYC = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useSelector((state) => state.auth);
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  useEffect(() => {
    if (accessToken) {
      fetchDocuments();
    }
  }, [accessToken]);
  
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/documents/my');
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadType || !uploadFile) {
      alert('Please select document type and file');
      return;
    }
    
    setUploadLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('document_type', uploadType);
      formData.append('file', uploadFile);
      
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert('Document uploaded successfully! Under review.');
      setUploadModal(false);
      setUploadType('');
      setUploadFile(null);
      fetchDocuments();
    } catch (error) {
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };
  
  const getStatusConfig = (status) => {
    const configs = {
      approved: { variant: 'success', icon: CheckCircle, label: 'Verified' },
      pending: { variant: 'warning', icon: Clock, label: 'Under Review' },
      rejected: { variant: 'danger', icon: XCircle, label: 'Rejected' },
    };
    return configs[status] || configs.pending;
  };
  
  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const isFullyVerified = approvedCount >= 2;
  
  const requiredDocuments = [
    { type: 'nid', label: 'NID (National ID)', icon: User, description: 'Government issued ID card' },
    { type: 'driving_license', label: 'Driving License', icon: Car, description: 'Valid driving license' },
    { type: 'vehicle_photo', label: 'Face Photo / Selfie', icon: Camera, description: 'For identity verification' },
  ];
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Driver Verification</h1>
      <p className="text-slate-500 mb-6">Complete verification to book and drive vehicles</p>
      
      {/* Status Card */}
      <Card className={`mb-6 ${isFullyVerified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center gap-3">
          <Shield className={`w-8 h-8 shrink-0 ${isFullyVerified ? 'text-green-600' : 'text-yellow-600'}`} />
          <div>
            <p className={`font-semibold ${isFullyVerified ? 'text-green-800' : 'text-yellow-800'}`}>
              {isFullyVerified ? 'Verification Complete!' : 'Verification Required'}
            </p>
            <p className="text-sm mt-1">
              {isFullyVerified
                ? 'You can now book vehicles on UDrive.'
                : `Upload required documents to start booking. (${approvedCount}/2 verified)`}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Required Documents */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Required Documents</h2>
      
      <div className="space-y-4 mb-6">
        {requiredDocuments.map((doc) => {
          const existing = documents.find((d) => d.document_type === doc.type);
          const statusConfig = existing ? getStatusConfig(existing.status) : null;
          const DocIcon = doc.icon;
          const StatusIcon = statusConfig?.icon;
          
          return (
            <Card key={doc.type} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                <DocIcon className="w-6 h-6 text-slate-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900">{doc.label}</p>
                <p className="text-xs text-slate-500">{doc.description}</p>
                
                {existing && (
                  <p className="text-xs text-slate-400 mt-1">
                    Uploaded: {formatDate(existing.created_at)}
                  </p>
                )}
              </div>
              
              {statusConfig ? (
                <Badge variant={statusConfig.variant} size="sm">
                  {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                  {statusConfig.label}
                </Badge>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setUploadType(doc.type);
                    setUploadModal(true);
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              )}
            </Card>
          );
        })}
      </div>
      
      {/* All Documents */}
      {documents.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Uploaded Documents</h2>
          <div className="space-y-3">
            {documents.map((doc) => {
              const statusConfig = getStatusConfig(doc.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card key={doc.id} className="flex items-center gap-3 py-3">
                  <FileText className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {doc.document_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-xs text-slate-400">Uploaded: {formatDate(doc.created_at)}</p>
                  </div>
                  <Badge variant={statusConfig.variant} size="sm">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </Card>
              );
            })}
          </div>
        </>
      )}
      
      {/* Notice */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Why Verification Required?</p>
            <ul className="mt-2 space-y-1 text-sm text-blue-600">
              <li>• Ensures driver identity for vehicle safety</li>
              <li>• Legal compliance for vehicle rental</li>
              <li>• Premium vehicles require full verification</li>
              <li>• Review takes 24-48 hours</li>
            </ul>
          </div>
        </div>
      </Card>
      
      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setUploadModal(false)} />
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Document
            </h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Document Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
                  required
                >
                  <option value="">Select document type</option>
                  <option value="nid">NID (National ID)</option>
                  <option value="driving_license">Driving License</option>
                  <option value="vehicle_photo">Face Photo / Selfie</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">File</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" fullWidth type="button" onClick={() => setUploadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" fullWidth isLoading={uploadLoading}>
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerKYC;