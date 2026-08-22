import { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  User,
  Camera,
  AlertCircle,
  Send,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import CameraCapture from '../../components/ui/CameraCapture';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const OwnerDocuments = () => {
  const { accessToken } = useSelector((state) => state.auth);

  const [existingDocuments, setExistingDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingUploads, setPendingUploads] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraForType, setCameraForType] = useState('');

  const fetchDocuments = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/documents/my');
      const docs = response.data.data || [];
      const docMap = {};
      docs.forEach((doc) => {
        docMap[doc.document_type] = doc;
      });
      setExistingDocuments(docMap);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setError(error.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // ✅ ONLY Owner Identity Documents (No vehicle docs)
  const ownerIdentityDocuments = [
    { type: 'nid', label: 'Owner NID', icon: User, camera: false, desc: 'National ID card' },
    { type: 'face_photo', label: 'Owner Face Photo', icon: Camera, camera: true, desc: 'Live camera capture' },
    { type: 'driving_license', label: 'Owner Driving License', icon: User, camera: false, desc: 'Valid driving license' },
  ];

  const handleFileSelect = (docType, file) => {
    setPendingUploads((prev) => ({ ...prev, [docType]: file }));
  };

  const handleRemovePending = (docType) => {
    setPendingUploads((prev) => {
      const newState = { ...prev };
      delete newState[docType];
      return newState;
    });
  };

  const handleCameraCapture = (file, previewUrl, docType) => {
    setPendingUploads((prev) => ({ ...prev, [docType]: file }));
    setCameraOpen(false);
  };

  const handleSubmitAll = async () => {
    const pendingTypes = Object.keys(pendingUploads);

    if (pendingTypes.length === 0) {
      alert('No new documents to submit. Upload documents first.');
      return;
    }

    if (!confirm(`Submit ${pendingTypes.length} document(s) for review?`)) return;

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

      alert(`${successCount} document(s) submitted for review!`);
      setPendingUploads({});
      fetchDocuments();
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      approved: { variant: 'success', icon: CheckCircle, label: 'Approved' },
      pending: { variant: 'warning', icon: Clock, label: 'Under Review' },
      rejected: { variant: 'danger', icon: XCircle, label: 'Rejected' },
    };
    return configs[status] || configs.pending;
  };

  const approvedCount = ownerIdentityDocuments.filter((doc) => 
    existingDocuments[doc.type]?.status === 'approved'
  ).length;
  
  const underReviewCount = ownerIdentityDocuments.filter((doc) =>
    existingDocuments[doc.type]?.status === 'pending'
  ).length;
  
  const rejectedCount = ownerIdentityDocuments.filter((doc) =>
    existingDocuments[doc.type]?.status === 'rejected'
  ).length;
  
  const pendingLocalCount = Object.keys(pendingUploads).length;
  const totalRequired = ownerIdentityDocuments.length;
  const progressPercent = Math.round((approvedCount / totalRequired) * 100);
  const isFullyVerified = approvedCount >= totalRequired;

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (error && Object.keys(existingDocuments).length === 0) {
    return <ErrorState title="Failed to Load Documents" message={error} onRetry={fetchDocuments} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Owner KYC Verification</h1>
        <p className="text-slate-500">Verify your identity to list vehicles on UDrive</p>
      </div>

      {/* Status Card */}
      <Card className={`mb-6 ${isFullyVerified ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex items-center gap-4 mb-3">
          <Shield className={`w-8 h-8 shrink-0 ${isFullyVerified ? 'text-green-600' : 'text-blue-600'}`} />
          <div className="flex-1">
            <p className={`font-bold ${isFullyVerified ? 'text-green-800' : 'text-blue-800'}`}>
              {isFullyVerified ? '✅ Identity Verified!' : `Verification: ${approvedCount}/${totalRequired}`}
            </p>
            <p className="text-sm text-slate-600">
              {underReviewCount > 0 && `${underReviewCount} under review`}
              {rejectedCount > 0 && ` • ${rejectedCount} rejected`}
              {pendingLocalCount > 0 && ` • ${pendingLocalCount} ready`}
            </p>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div className={`h-2.5 rounded-full ${isFullyVerified ? 'bg-green-600' : 'bg-blue-600'}`} style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> {approvedCount} Approved</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-yellow-600" /> {underReviewCount} Review</span>
          <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-red-600" /> {rejectedCount} Rejected</span>
        </div>
      </Card>

      {/* Identity Documents Only */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Identity Documents</h2>

      <div className="space-y-3">
        {ownerIdentityDocuments.map((doc) => {
          const existing = existingDocuments[doc.type];
          const pending = pendingUploads[doc.type];
          const statusConfig = existing ? getStatusConfig(existing.status) : null;
          const DocIcon = doc.icon;
          const StatusIcon = statusConfig?.icon;

          return (
            <Card key={doc.type} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <DocIcon className="w-5 h-5 text-slate-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{doc.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {existing
                      ? `Uploaded: ${formatDate(existing.created_at)}`
                      : pending
                        ? 'Ready to submit ✓'
                        : doc.desc}
                  </p>
                </div>

                {statusConfig ? (
                  <div className="text-right shrink-0">
                    <Badge variant={statusConfig.variant} size="sm">
                      {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                      {statusConfig.label}
                    </Badge>
                    {existing?.status === 'rejected' && (
                      <label className="block text-xs text-blue-600 hover:underline mt-1 cursor-pointer">
                        Re-upload
                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => { if (e.target.files[0]) handleFileSelect(doc.type, e.target.files[0]); }} />
                      </label>
                    )}
                  </div>
                ) : pending ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="primary" size="sm">Ready</Badge>
                    <button onClick={() => handleRemovePending(doc.type)} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                ) : doc.camera ? (
                  <Button size="sm" onClick={() => { setCameraForType(doc.type); setCameraOpen(true); }}>
                    <Camera className="w-4 h-4" />
                    Open Camera
                  </Button>
                ) : (
                  <label className="cursor-pointer shrink-0">
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => { if (e.target.files[0]) handleFileSelect(doc.type, e.target.files[0]); }} />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      <Upload className="w-4 h-4" />
                      Upload
                    </span>
                  </label>
                )}
              </div>

              {existing?.status === 'rejected' && existing.rejection_reason && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                    <span><strong>Rejection Reason:</strong> {existing.rejection_reason}</span>
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      {pendingLocalCount > 0 && (
        <Button fullWidth size="lg" onClick={handleSubmitAll} isLoading={submitting} className="mt-6">
          <Send className="w-5 h-5" />
          {submitting ? 'Submitting...' : `Submit ${pendingLocalCount} Document(s) for Review`}
        </Button>
      )}

      {/* Notice */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800 text-sm">Next Steps</p>
            <ul className="mt-2 space-y-1 text-xs text-blue-600">
              <li>• Vehicle documents (RC, Insurance) upload হয় Add Vehicle form-এ</li>
              <li>• Identity verified হলে Add Vehicle unlock হবে</li>
              <li>• Vehicle approval admin আলাদাভাবে করবে</li>
            </ul>
          </div>
        </div>
      </Card>

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

export default OwnerDocuments;