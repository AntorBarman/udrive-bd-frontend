import { useState, useEffect } from 'react';
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
  Send,
  Trash2,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import CameraCapture from '../../components/ui/CameraCapture';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const CustomerKYC = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  // Existing documents from backend
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Local upload state (not yet submitted)
  const [pendingUploads, setPendingUploads] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Camera
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraForType, setCameraForType] = useState('');
  
  useEffect(() => {
    if (accessToken) fetchExistingDocuments();
  }, [accessToken]);
  
  const fetchExistingDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/documents/my');
      const docs = response.data.data || [];
      
      // Map by type for easy lookup
      const docMap = {};
      docs.forEach((doc) => {
        docMap[doc.document_type] = doc;
      });
      
      setExistingDocuments(docMap);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setExistingDocuments({});
    } finally {
      setLoading(false);
    }
  };
  
  const requiredDocuments = [
    { type: 'nid_front', label: 'NID Front Side', icon: User, category: 'Identity', camera: false },
    { type: 'nid_back', label: 'NID Back Side', icon: User, category: 'Identity', camera: false },
    { type: 'driving_license_front', label: 'License Front', icon: Car, category: 'License', camera: false },
    { type: 'driving_license_back', label: 'License Back', icon: Car, category: 'License', camera: false },
    { type: 'face_photo', label: 'Live Face Photo', icon: Camera, category: 'Identity', camera: true },
  ];
  
  const handleFileSelect = (docType, file) => {
    setPendingUploads((prev) => ({
      ...prev,
      [docType]: file,
    }));
  };
  
  const handleRemovePending = (docType) => {
    setPendingUploads((prev) => {
      const newState = { ...prev };
      delete newState[docType];
      return newState;
    });
  };
  
  const handleCameraCapture = (file, previewUrl, docType) => {
    setPendingUploads((prev) => ({
      ...prev,
      [docType]: file,
    }));
    setCameraOpen(false);
  };
  
  const handleSubmitAll = async () => {
    const pendingTypes = Object.keys(pendingUploads);
    
    if (pendingTypes.length === 0) {
      alert('Please upload documents first');
      return;
    }
    
    // Check if all required documents are either uploaded or already approved
    const missingRequired = requiredDocuments.filter((doc) => {
      const existing = existingDocuments[doc.type];
      const pending = pendingUploads[doc.type];
      return !existing && !pending;
    });
    
    if (missingRequired.length > 0) {
      alert(`Please upload: ${missingRequired.map((d) => d.label).join(', ')}`);
      return;
    }
    
    if (!confirm('Submit all documents for review?')) return;
    
    setSubmitting(true);
    
    try {
      let successCount = 0;
      
      for (const docType of pendingTypes) {
        const file = pendingUploads[docType];
        
        const formData = new FormData();
        formData.append('document_type', docType);
        formData.append('file', file);
        
        try {
          await api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to upload ${docType}:`, error);
        }
      }
      
      alert(`${successCount} documents submitted for review!`);
      setPendingUploads({});
      fetchExistingDocuments();
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
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
  
  // Count verified docs
  const verifiedCount = requiredDocuments.filter((doc) => 
    existingDocuments[doc.type]?.status === 'approved'
  ).length;
  
  // Count pending (already submitted + local pending)
  const pendingCount = requiredDocuments.filter((doc) => {
    const existing = existingDocuments[doc.type];
    const pending = pendingUploads[doc.type];
    return existing?.status === 'pending' || (pending && !existing);
  }).length;
  
  // Check if all required have been submitted
  const allSubmitted = requiredDocuments.every((doc) => {
    return existingDocuments[doc.type] || pendingUploads[doc.type];
  });
  
  const totalRequired = requiredDocuments.length;
  const progressPercent = Math.round((verifiedCount / totalRequired) * 100);
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Driver Verification</h1>
      <p className="text-slate-500 mb-6">Upload all documents, then submit for review</p>
      
      {/* Status Card */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-4 mb-3">
          <Shield className="w-8 h-8 text-blue-600 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-blue-800">
              {verifiedCount === totalRequired ? '✅ Fully Verified' : `Verification: ${verifiedCount}/${totalRequired}`}
            </p>
            <p className="text-sm text-slate-600">
              {pendingCount > 0 ? `${pendingCount} documents under review` : 'Upload all documents below'}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>
      
      {/* Documents List */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Upload Documents</h2>
      
      <div className="space-y-3">
        {requiredDocuments.map((doc) => {
          const existing = existingDocuments[doc.type];
          const pending = pendingUploads[doc.type];
          const statusConfig = existing ? getStatusConfig(existing.status) : null;
          const DocIcon = doc.icon;
          const StatusIcon = statusConfig?.icon;
          
          return (
            <Card key={doc.type} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <DocIcon className="w-5 h-5 text-slate-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{doc.label}</p>
                  <p className="text-xs text-slate-500">
                    {existing
                      ? `Uploaded: ${formatDate(existing.created_at)}`
                      : pending
                        ? 'Ready to submit ✓'
                        : doc.camera ? 'Camera capture required' : 'Upload file'}
                  </p>
                </div>
                
                {/* Status */}
                {statusConfig ? (
                  <Badge variant={statusConfig.variant} size="sm">
                    {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                    {statusConfig.label}
                  </Badge>
                ) : pending ? (
                  <>
                    <Badge variant="primary" size="sm">Pending Submit</Badge>
                    <button onClick={() => handleRemovePending(doc.type)} className="text-xs text-red-500 hover:underline">
                      Remove
                    </button>
                  </>
                ) : doc.camera ? (
                  <Button size="sm" onClick={() => { setCameraForType(doc.type); setCameraOpen(true); }}>
                    <Camera className="w-4 h-4" />
                    Open Camera
                  </Button>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(doc.type, e.target.files[0])}
                    />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      <Upload className="w-4 h-4" />
                      Upload
                    </span>
                  </label>
                )}
              </div>
              
              {/* Rejection Reason */}
              {existing?.status === 'rejected' && existing.rejection_reason && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {existing.rejection_reason}
                </p>
              )}
            </Card>
          );
        })}
      </div>
      
      {/* Submit Button */}
      <Button
        fullWidth
        size="lg"
        onClick={handleSubmitAll}
        isLoading={submitting}
        disabled={Object.keys(pendingUploads).length === 0}
        className="mt-6"
      >
        <Send className="w-5 h-5" />
        {submitting ? 'Submitting...' : `Submit ${Object.keys(pendingUploads).length} Documents for Review`}
      </Button>
      
      <p className="text-center text-xs text-slate-400 mt-3">
        All documents will be reviewed together by our admin team within 24-48 hours
      </p>
      
      {/* Camera Modal */}
      {cameraOpen && (
        <CameraCapture
          onCapture={(file, preview) => handleCameraCapture(file, preview, cameraForType)}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerKYC;