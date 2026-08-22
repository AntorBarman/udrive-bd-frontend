import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  FileText, 
  Car,
  Eye,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const VehicleDocuments = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Review Drawer
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [reviewAction, setReviewAction] = useState(null); // 'approve' | 'reject'
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  const fetchDocuments = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/admin/kyc');
      const allDocs = response.data.data || [];
      
      // Filter vehicle-related documents with vehicle info
      const vehicleDocs = allDocs.filter((d) => {
        const isVehicleDoc = ['vehicle_rc', 'insurance', 'tax_token'].includes(d.document_type);
        return isVehicleDoc && d.vehicle_id;
      });
      
      setDocuments(vehicleDocs);
    } catch (error) {
      setError('Failed to load vehicle documents');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const handleApprove = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    
    try {
      await api.patch(`/admin/kyc/${selectedDoc.id}/approve`);
      alert('Document approved!');
      setSelectedDoc(null);
      setReviewAction(null);
      fetchDocuments();
    } catch (error) {
      alert('Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Rejection reason is required');
      return;
    }
    
    setActionLoading(true);
    try {
      await api.patch(`/admin/kyc/${selectedDoc.id}/reject`, { reason: rejectReason });
      alert('Document rejected');
      setSelectedDoc(null);
      setReviewAction(null);
      setRejectReason('');
      fetchDocuments();
    } catch (error) {
      alert('Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };
  
  const filteredDocs = documents.filter((doc) => {
    const searchStr = `${doc.user_name || ''} ${doc.brand || ''} ${doc.model || ''} ${doc.document_type || ''}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const pendingCount = documents.filter((d) => d.status === 'pending').length;
  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const rejectedCount = documents.filter((d) => d.status === 'rejected').length;
  
  if (loading) {
    return (
      <div>
        <PageHeader title="Vehicle Documents" />
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <PageHeader title="Vehicle Documents" />
        <ErrorState title="Failed" message={error} onRetry={fetchDocuments} />
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader 
        title="Vehicle Documents" 
        description="Verify vehicle registration, insurance, and tax documents"
      />
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-3">
          <p className="text-[10px] text-slate-500 uppercase">Total</p>
          <p className="text-lg font-bold">{documents.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] text-yellow-600 uppercase">Pending</p>
          <p className="text-lg font-bold text-yellow-700">{pendingCount}</p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] text-green-600 uppercase">Approved</p>
          <p className="text-lg font-bold text-green-700">{approvedCount}</p>
        </Card>
        <Card className="p-3">
          <p className="text-[10px] text-red-600 uppercase">Rejected</p>
          <p className="text-lg font-bold text-red-700">{rejectedCount}</p>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-3">
        <div className="flex-1">
          <Input
            placeholder="Search owner, vehicle, document type..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="all">All Types</option>
          <option value="vehicle_rc">Registration</option>
          <option value="insurance">Insurance</option>
          <option value="tax_token">Tax Token</option>
        </select>
      </div>
      
      {/* Documents Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Document</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Uploaded</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium">{doc.user_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {doc.brand ? `${doc.brand} ${doc.model || ''}` : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs capitalize bg-slate-100 px-2 py-0.5 rounded">
                      {doc.document_type?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(doc.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedDoc(doc); setReviewAction(null); }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {doc.status === 'pending' ? 'Review' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredDocs.length === 0 && (
          <div className="py-10">
            <EmptyState title="No Vehicle Documents" icon={FileText} />
          </div>
        )}
      </Card>
      
      {/* ============ REVIEW DRAWER ============ */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedDoc(null)} />
          
          <div className="absolute right-0 top-0 bottom-0 w-96 max-w-[90%] bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Document Review</h3>
                <button onClick={() => setSelectedDoc(null)} className="p-1.5 hover:bg-slate-100 rounded">✕</button>
              </div>
              <p className="text-sm text-slate-500 capitalize">
                {selectedDoc.document_type?.replace(/_/g, ' ')}
              </p>
              <StatusBadge status={selectedDoc.status} size="sm" className="mt-1" />
            </div>
            
            <div className="p-4 space-y-4">
              {/* Info */}
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-500">Owner:</span> {selectedDoc.user_name || 'N/A'}</p>
                <p><span className="text-slate-500">Vehicle:</span> {selectedDoc.brand ? `${selectedDoc.brand} ${selectedDoc.model || ''}` : 'N/A'}</p>
                <p><span className="text-slate-500">Uploaded:</span> {formatDate(selectedDoc.created_at)}</p>
              </div>
              
              {/* Preview */}
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                {selectedDoc.document_url && selectedDoc.document_url.startsWith('http') ? (
                  <img
                    src={selectedDoc.document_url}
                    alt="Document preview"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-slate-300" />
                )}
              </div>
              
              {/* Rejection Reason if rejected */}
              {selectedDoc.status === 'rejected' && selectedDoc.rejection_reason && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-700">
                    <strong>Rejection Reason:</strong> {selectedDoc.rejection_reason}
                  </p>
                </div>
              )}
              
              {/* Actions for pending */}
              {selectedDoc.status === 'pending' && (
                <div className="space-y-3">
                  {reviewAction === null ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" fullWidth onClick={() => setReviewAction('approve')}>
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Button size="sm" variant="danger" fullWidth onClick={() => setReviewAction('reject')}>
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </div>
                  ) : reviewAction === 'approve' ? (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Approve this document?</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" fullWidth onClick={() => setReviewAction(null)}>Cancel</Button>
                        <Button size="sm" variant="success" fullWidth onClick={handleApprove} isLoading={actionLoading}>
                          Confirm Approve
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-medium mb-1 block">Rejection Reason *</label>
                      <textarea
                        rows="3"
                        placeholder="e.g., Document is unclear, expired, mismatch..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm mb-2"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" fullWidth onClick={() => setReviewAction(null)}>Cancel</Button>
                        <Button size="sm" variant="danger" fullWidth onClick={handleReject} isLoading={actionLoading}>
                          Confirm Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDocuments;