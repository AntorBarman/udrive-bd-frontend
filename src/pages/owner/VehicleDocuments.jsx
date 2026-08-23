import { useState, useEffect, useCallback } from 'react';
import { FileText, Car, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import vehicleService from '../../services/vehicleService';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

const OwnerVehicleDocuments = () => {
  const { accessToken } = useSelector((state) => state.auth);
  
  const [vehicles, setVehicles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    
    try {
      const [vehiclesRes, docsRes] = await Promise.all([
        vehicleService.getMyVehicles(),
        api.get('/documents/my'),
      ]);
      
      setVehicles(vehiclesRes.data || []);
      setDocuments(docsRes.data.data || []);
    } catch (error) {
      setError('Failed to load vehicle documents');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);
  
  useEffect(() => { fetchData(); }, [fetchData]);
  
  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  if (error) return <ErrorState title="Failed" message={error} onRetry={fetchData} />;
  
  const getDocStatus = (vehicleId, docType) => {
    const doc = documents.find((d) => d.vehicle_id === vehicleId && d.document_type === docType);
    return doc ? doc.status : 'missing';
  };
  
  const requiredDocs = [
    { type: 'vehicle_rc', label: 'Registration Certificate' },
    { type: 'insurance', label: 'Insurance' },
    { type: 'tax_token', label: 'Tax Token' },
  ];
  
  return (
    <div>
      <PageHeader title="Vehicle Documents" description="Verify vehicle registration and legal documents" />
      
      {vehicles.length > 0 ? (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold">
                  {vehicle.brand === vehicle.model ? vehicle.brand : `${vehicle.brand} ${vehicle.model}`}
                </p>
                <span className="text-xs text-slate-400">{vehicle.year}</span>
              </div>
              
              <div className="space-y-2">
                {requiredDocs.map((doc) => {
                  const status = getDocStatus(vehicle.id, doc.type);
                  
                  return (
                    <div key={doc.type} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">{doc.label}</span>
                      
                      {status === 'approved' ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                      ) : status === 'pending' ? (
                        <Badge variant="warning" size="sm">
                          <Clock className="w-3 h-3 mr-1" /> Under Review
                        </Badge>
                      ) : status === 'rejected' ? (
                        <Badge variant="danger" size="sm">
                          <XCircle className="w-3 h-3 mr-1" /> Rejected
                        </Badge>
                      ) : (
                        <Badge variant="default" size="sm">Missing</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Rejection reasons */}
              {documents
                .filter((d) => d.vehicle_id === vehicle.id && d.status === 'rejected' && d.rejection_reason)
                .map((doc) => (
                  <p key={doc.id} className="text-[10px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {doc.document_type?.replace(/_/g, ' ')}: {doc.rejection_reason}
                  </p>
                ))}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Vehicles"
          description="Add a vehicle to upload its documents."
          icon={Car}
        />
      )}
    </div>
  );
};

export default OwnerVehicleDocuments;