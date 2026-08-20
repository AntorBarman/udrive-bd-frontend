import { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  User,
  Car,
  FileText,
  Shield,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const KYC = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  
  const fetchDocuments = useCallback(async () => {
    if (!accessToken) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/admin/kyc');
      console.log('🔍 KYC documents:', response.data);
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch KYC:', error);
      if (error.response?.status === 404) {
        setError('KYC endpoint not available. Please check backend.');
      } else {
        setError(error.response?.data?.message || 'Failed to load KYC documents');
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken]);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const handleApprove = async (docId) => {
    if (!confirm('Approve this document?')) return;
    
    setActionLoading(docId);
    try {
      await api.patch(`/admin/kyc/${docId}/approve`);
      alert('Document approved');
      fetchDocuments();
    } catch (error) {
      alert(error.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleReject = async (docId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    setActionLoading(docId);
    try {
      await api.patch(`/admin/kyc/${docId}/reject`, { reason });
      alert('Document rejected');
      fetchDocuments();
    } catch (error) {
      alert(error.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };
  
  const getStatusConfig = (status) => {
    const configs = {
      approved: { variant: 'success', icon: CheckCircle, label: 'Approved' },
      pending: { variant: 'warning', icon: Clock, label: 'Pending' },
      rejected: { variant: 'danger', icon: XCircle, label: 'Rejected' },
    };
    return configs[status] || configs.pending;
  };
  
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      (doc.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.document_type || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
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
        title="Failed to Load KYC"
        message={error}
        onRetry={fetchDocuments}
      />
    );
  }
  
  const pendingCount = documents.filter((d) => d.status === 'pending').length;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">KYC Reviews</h1>
        <p className="text-slate-500">
          Review and manage user verification documents
          {pendingCount > 0 && (
            <span className="ml-2 text-yellow-600 font-medium">
              ({pendingCount} pending)
            </span>
          )}
        </p>
      </div>
      
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by user or document type..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => {
            const statusConfig = getStatusConfig(doc.status);
            const StatusIcon = statusConfig.icon;
            const DocIcon = doc.document_type?.includes('vehicle') ? Car : User;
            
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
                    <Badge variant={statusConfig.variant} size="sm">
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {doc.user_name || 'Unknown User'} • {doc.user_email || ''}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted: {formatDate(doc.created_at)}
                  </p>
                  
                  {doc.rejection_reason && (
                    <p className="text-xs text-red-600 mt-1">
                      Reason: {doc.rejection_reason}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {doc.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(doc.id)}
                        isLoading={actionLoading === doc.id}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(doc.id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No KYC Documents"
          description="User verification documents will appear here."
          icon={Shield}
        />
      )}
    </div>
  );
};

export default KYC;