import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Shield,
  UserCheck,
  CarFront,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  User,
  Camera,
  FileText,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const AdminKYC = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'customer';
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(initialType);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // Customer documents
  const customerDocTypes = {
    'nid_front': { label: 'NID Front', icon: User },
    'nid_back': { label: 'NID Back', icon: User },
    'driving_license_front': { label: 'License Front', icon: CarFront },
    'driving_license_back': { label: 'License Back', icon: CarFront },
    'face_photo': { label: 'Face Photo', icon: Camera },
  };
  
  // Owner documents (identity only)
  const ownerDocTypes = {
    'nid': { label: 'Owner NID', icon: User },
    'face_photo': { label: 'Owner Face Photo', icon: Camera },
    'driving_license': { label: 'Owner Driving License', icon: CarFront },
  };
  
  const fetchDocuments = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/admin/kyc');
      setDocuments(response.data.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load KYC');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const groupByUser = (docs) => {
    const groups = {};
    docs.forEach((doc) => {
      const key = doc.user_id;
      if (!groups[key]) {
        groups[key] = {
          user_id: doc.user_id,
          user_name: doc.user_name,
          user_email: doc.user_email,
          user_phone: doc.user_phone,
          documents: [],
        };
      }
      groups[key].documents.push(doc);
    });
    return Object.values(groups);
  };
  
  const customerGroups = groupByUser(
    documents.filter((d) => Object.keys(customerDocTypes).includes(d.document_type))
  );
  
  const ownerGroups = groupByUser(
    documents.filter((d) => Object.keys(ownerDocTypes).includes(d.document_type))
  );
  
  const activeGroups = activeTab === 'customer' ? customerGroups : ownerGroups;
  const activeDocTypes = activeTab === 'customer' ? customerDocTypes : ownerDocTypes;
  
  const filteredGroups = activeGroups.filter((group) => {
    const searchStr = `${group.user_name} ${group.user_email}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const hasStatus = group.documents.some((d) => d.status === statusFilter);
    return matchesSearch && hasStatus;
  });
  
  const handleApprove = async (docId) => {
    setActionLoading(docId);
    try {
      await api.patch(`/admin/kyc/${docId}/approve`);
      fetchDocuments();
      // Update selectedUser
      if (selectedUser) {
        const updatedDocs = selectedUser.documents.map((d) =>
          d.id === docId ? { ...d, status: 'approved' } : d
        );
        setSelectedUser({ ...selectedUser, documents: updatedDocs });
      }
    } catch (error) {
      alert('Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide rejection reason');
      return;
    }
    
    setActionLoading(rejectModal);
    try {
      await api.patch(`/admin/kyc/${rejectModal}/reject`, { reason: rejectReason });
      fetchDocuments();
      if (selectedUser) {
        const updatedDocs = selectedUser.documents.map((d) =>
          d.id === rejectModal ? { ...d, status: 'rejected', rejection_reason: rejectReason } : d
        );
        setSelectedUser({ ...selectedUser, documents: updatedDocs });
      }
      setRejectModal(null);
      setRejectReason('');
    } catch (error) {
      alert('Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };
  
  const handleApproveAll = async (userId) => {
    if (!confirm('Approve ALL pending documents for this user?')) return;
    setActionLoading(`all-${userId}`);
    
    try {
      const pendingDocs = documents.filter((d) => d.user_id === userId && d.status === 'pending');
      for (const doc of pendingDocs) {
        await api.patch(`/admin/kyc/${doc.id}/approve`);
      }
      alert('All documents approved!');
      fetchDocuments();
      setSelectedUser(null);
    } catch (error) {
      alert('Failed');
    } finally {
      setActionLoading(null);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }
  
  if (error && documents.length === 0) {
    return <ErrorState title="Failed" message={error} onRetry={fetchDocuments} />;
  }
  
  return (
    <div>
      <PageHeader 
        title="KYC Verification Portal" 
        description="Review and verify customer & owner identity documents"
      />
      
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white border border-slate-200 rounded-lg p-1 w-fit">
        <button
          onClick={() => { setActiveTab('customer'); setSelectedUser(null); setStatusFilter('pending'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'customer' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Customer KYC
          <span className="text-xs opacity-70">({customerGroups.length})</span>
        </button>
        
        <button
          onClick={() => { setActiveTab('owner'); setSelectedUser(null); setStatusFilter('pending'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'owner' ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CarFront className="w-4 h-4" />
          Owner KYC
          <span className="text-xs opacity-70">({ownerGroups.length})</span>
        </button>
      </div>
      
      {selectedUser ? (
        /* ============ APPLICANT REVIEW VIEW ============ */
        <div>
          <button onClick={() => setSelectedUser(null)} className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </button>
          
          {/* Applicant Info Card */}
          <Card className="mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  activeTab === 'customer' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <span className={`text-lg font-bold ${activeTab === 'customer' ? 'text-blue-600' : 'text-green-600'}`}>
                    {selectedUser.user_name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedUser.user_name}</p>
                  <p className="text-sm text-slate-500">{selectedUser.user_email}</p>
                  <p className="text-xs text-slate-400">{selectedUser.user_phone}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="success" onClick={() => handleApproveAll(selectedUser.user_id)} isLoading={actionLoading === `all-${selectedUser.user_id}`}>
                  <Check className="w-4 h-4" />
                  Approve All
                </Button>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Verification Progress</span>
                <span>
                  {selectedUser.documents.filter((d) => d.status === 'approved').length}/{Object.keys(activeDocTypes).length} verified
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(selectedUser.documents.filter((d) => d.status === 'approved').length / Object.keys(activeDocTypes).length) * 100}%` }}
                />
              </div>
            </div>
          </Card>
          
          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(activeDocTypes).map(([docType, config]) => {
              const doc = selectedUser.documents.find((d) => d.document_type === docType);
              const DocIcon = config.icon;
              
              return (
                <Card key={docType} className="overflow-hidden">
                  {/* Header */}
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DocIcon className="w-4 h-4 text-slate-500" />
                      <p className="text-xs font-medium">{config.label}</p>
                    </div>
                    {doc ? (
                      <StatusBadge status={doc.status} size="xs" />
                    ) : (
                      <Badge variant="default" size="xs">Not Uploaded</Badge>
                    )}
                  </div>
                  
                  {/* Preview */}
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    {doc?.document_url && doc.document_url.startsWith('http') ? (
                      <img
                        src={doc.document_url}
                        alt={config.label}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <DocIcon className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  
                  {/* Actions */}
                  {doc && (
                    <div className="p-2">
                      {doc.status === 'pending' ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="success" fullWidth onClick={() => handleApprove(doc.id)} isLoading={actionLoading === doc.id}>
                            <Check className="w-3 h-3" /> Approve
                          </Button>
                          <Button size="sm" variant="danger" fullWidth onClick={() => setRejectModal(doc.id)}>
                            <X className="w-3 h-3" /> Reject
                          </Button>
                        </div>
                      ) : doc.status === 'rejected' ? (
                        <div className="p-2 bg-red-50 rounded">
                          <p className="text-xs text-red-700">{doc.rejection_reason || 'Rejected'}</p>
                        </div>
                      ) : (
                        <div className="p-2 bg-green-50 rounded">
                          <p className="text-xs text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* ============ APPLICANT LIST VIEW ============ */
        <>
          {/* Filters */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <Input
                placeholder={`Search ${activeTab === 'customer' ? 'customers' : 'owners'}...`}
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </select>
          </div>
          
          {/* Applicant List */}
          {filteredGroups.length > 0 ? (
            <div className="space-y-2">
              {filteredGroups.map((group) => {
                const approvedCount = group.documents.filter((d) => d.status === 'approved').length;
                const pendingCount = group.documents.filter((d) => d.status === 'pending').length;
                const totalRequired = Object.keys(activeDocTypes).length;
                
                return (
                  <Card
                    key={group.user_id}
                    hoverable
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => setSelectedUser(group)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activeTab === 'customer' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <span className={`font-bold ${activeTab === 'customer' ? 'text-blue-600' : 'text-green-600'}`}>
                        {group.user_name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{group.user_name}</p>
                        {pendingCount > 0 && <Badge variant="warning" size="xs">{pendingCount} pending</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{group.user_email}</p>
                      
                      {/* Progress */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 max-w-[100px] bg-slate-200 rounded-full h-1">
                          <div className="bg-green-600 h-1 rounded-full" style={{ width: `${(approvedCount / totalRequired) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500">{approvedCount}/{totalRequired}</span>
                      </div>
                    </div>
                    
                    <span className="text-xs text-blue-600 font-medium">Review →</span>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title={`No ${activeTab} KYC applications`}
              description="No applications match your filters."
              icon={Shield}
            />
          )}
        </>
      )}
      
      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRejectModal(null)} />
          <div className="relative bg-white rounded-xl p-5 max-w-sm w-full mx-4">
            <div className="flex items-start gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-slate-900">Reject Document</h3>
                <p className="text-xs text-slate-500">Provide reason for rejection</p>
              </div>
            </div>
            
            <textarea
              rows="3"
              placeholder="e.g., Document is unclear, expired, mismatch..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm mb-3"
            />
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" fullWidth onClick={() => setRejectModal(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" fullWidth onClick={handleRejectConfirm} isLoading={actionLoading === rejectModal}>
                Reject Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKYC;