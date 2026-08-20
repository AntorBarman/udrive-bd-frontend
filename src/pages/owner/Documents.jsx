import { useState, useEffect, useCallback } from 'react';
import {
    Upload,
    CheckCircle,
    Clock,
    XCircle,
    Shield,
    User,
    Car,
    AlertCircle,
    FileText,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const Documents = () => {
    const { accessToken } = useSelector((state) => state.auth);

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadType, setUploadType] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    const fetchDocuments = useCallback(async () => {
        if (!accessToken) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/documents/my');
            console.log('🔍 Documents response:', response.data);
            setDocuments(response.data.data || response.data || []);
        } catch (error) {
            console.error('❌ Failed to fetch documents:', error);
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
            } else if (error.response?.status === 404) {
                // Endpoint might not exist yet
                setDocuments([]);
                setError('Documents API not available yet. Please check backend.');
            } else {
                setError(error.response?.data?.message || 'Failed to load documents');
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!uploadType || !uploadFile) {
            alert('Please select document type and file');
            return;
        }

        setUploadLoading(true);

        try {
            const formData = new FormData();
            formData.append('document_type', uploadType);  // ✅ Field name match
            formData.append('file', uploadFile);           // ✅ Multer expect 'file'

            console.log('🔍 Uploading:', {
                document_type: uploadType,
                file_name: uploadFile.name,
                file_size: uploadFile.size,
            });

            const response = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('✅ Upload response:', response.data);

            alert('Document uploaded successfully! Under review.');
            setUploadModal(false);
            setUploadType('');
            setUploadFile(null);
            fetchDocuments();
        } catch (error) {
            console.error('❌ Upload failed:', error);
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploadLoading(false);
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

    const getDocumentIcon = (type) => {
        if (type.includes('nid') || type.includes('driving')) return User;
        if (type.includes('vehicle') || type.includes('insurance')) return Car;
        return FileText;
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error && documents.length === 0) {
        return (
            <ErrorState
                title="Failed to Load Documents"
                message={error}
                onRetry={fetchDocuments}
            />
        );
    }

    const approvedCount = documents.filter((d) => d.status === 'approved').length;
    const pendingCount = documents.filter((d) => d.status === 'pending').length;
    const rejectedCount = documents.filter((d) => d.status === 'rejected').length;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">KYC & Documents</h1>
                    <p className="text-slate-500">Upload and manage your verification documents</p>
                </div>

                <Button onClick={() => setUploadModal(true)} className="mt-4 sm:mt-0">
                    <Upload className="w-4 h-4" />
                    Upload Document
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Approved</p>
                        <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Under Review</p>
                        <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Rejected</p>
                        <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
                    </div>
                </Card>
            </div>

            {/* Documents List */}
            <h2 className="text-lg font-semibold text-slate-900 mb-4">All Documents</h2>

            {documents.length > 0 ? (
                <div className="space-y-4">
                    {documents.map((doc) => {
                        const statusConfig = getStatusConfig(doc.status);
                        const StatusIcon = statusConfig.icon;
                        const DocIcon = getDocumentIcon(doc.document_type || '');

                        return (
                            <Card key={doc.id} className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <DocIcon className="w-6 h-6 text-slate-600" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-slate-900">
                                            {doc.document_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Uploaded: {formatDate(doc.created_at)}
                                    </p>

                                    {doc.rejection_reason && (
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {doc.rejection_reason}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge variant={statusConfig.variant}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {statusConfig.label}
                                    </Badge>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    title="No Documents Yet"
                    description="Upload your NID, driving license, and vehicle documents to get verified."
                    icon={FileText}
                    action={
                        <Button onClick={() => setUploadModal(true)}>
                            <Upload className="w-4 h-4" />
                            Upload Document
                        </Button>
                    }
                />
            )}

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
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Document Type
                                </label>
                                {/* Document Type Select */}
                                <select
                                    value={uploadType}
                                    onChange={(e) => setUploadType(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
                                    required
                                >
                                    <option value="">Select document type</option>
                                    <option value="nid">NID</option>
                                    <option value="driving_license">Driving License</option>
                                    <option value="vehicle_rc">Vehicle Registration</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="vehicle_photo">Vehicle Photo</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    File
                                </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
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

export default Documents;