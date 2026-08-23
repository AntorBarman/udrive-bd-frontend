import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Save,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Trash2,
  Banknote,
  Bell,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/admin/PageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import api from '../../services/api';
import { logout, updateUser } from '../../features/auth/authSlice';
import { formatDate } from '../../utils/formatters';

const OwnerSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Profile state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password modal
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Deactivate modal
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  // KYC status
  const [documents, setDocuments] = useState([]);

  // Payout methods (real API থেকে আসবে)
  const [payoutMethods, setPayoutMethods] = useState([]);

  useEffect(() => {
    fetchKycStatus();
    fetchPayoutMethods();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const response = await api.get('/documents/my');
      setDocuments(response.data.data || []);
    } catch (error) {
      setDocuments([]);
    }
  };

  const fetchPayoutMethods = async () => {
    try {
      const response = await api.get('/users/payout-methods');
      setPayoutMethods(response.data.data || []);
    } catch (error) {
      setPayoutMethods([]);
    }
  };

  // ============ PROFILE UPDATE ============
  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await api.patch('/users/profile', {
        name: formData.name,
        phone: formData.phone,
      });

      dispatch(updateUser({ name: formData.name, phone: formData.phone }));
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // ============ AVATAR UPLOAD ============
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📸 File selected:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('Only image files allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      console.log('📤 Uploading avatar...');

      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('✅ Avatar response:', response.data);

      const avatarUrl = response.data.data?.avatar_url;
      if (avatarUrl) {
        setAvatarPreview(avatarUrl);
        dispatch(updateUser({ avatar_url: avatarUrl }));
        alert('Avatar updated!');
      }
    } catch (error) {
      console.error('❌ Avatar upload failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to upload avatar');
    }
  };

  // ============ PASSWORD CHANGE ============
  const handleChangePassword = async () => {
    setPasswordError('');

    // Direct access without trim
    const currentPass = passwordData.currentPassword;
    const newPass = passwordData.newPassword;
    const confirmPass = passwordData.confirmPassword;

    console.log('🔍 DEBUG:', {
      currentPass,
      newPass,
      confirmPass,
      newLength: newPass?.length,
    });

    if (!currentPass || currentPass.length === 0) {
      setPasswordError('Current password is required');
      return;
    }

    if (!newPass || newPass.length === 0) {
      setPasswordError('New password is required');
      return;
    }

    // ✅ ONLY check minimum length
    if (newPass.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (newPass !== confirmPass) {
      setPasswordError('Passwords do not match');
      return;
    }

    // ✅ NO REGEX CHECK - let backend validate
    setPasswordLoading(true);

    try {
      const response = await api.post('/users/change-password', {
        current_password: currentPass,
        new_password: newPass,
      });

      alert('Password changed!');
      setPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };
  // ============ DEACTIVATE ============
  const handleDeactivate = async () => {
    setDeactivateLoading(true);

    try {
      await api.patch('/users/deactivate');
      alert('Account deactivated');
      await dispatch(logout());
      navigate('/login');
    } catch (error) {
      alert('Failed to deactivate');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const approvedDocs = documents.filter((d) => d.status === 'approved');
  const kycComplete = approvedDocs.length >= 2;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <PageHeader title="Settings" description="Manage your account, security and business preferences" />

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{errorMsg}</div>
      )}

      {/* ============ PROFILE HEADER ============ */}
      <Card className="p-4 flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-green-600">{user?.name?.[0]?.toUpperCase() || 'O'}</span>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 bg-green-600 text-white p-1.5 rounded-full cursor-pointer">
            <Camera className="w-3 h-3" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{user?.name}</p>
          <p className="text-sm text-slate-500 truncate">{user?.email}</p>
          <Badge variant="success" size="sm" className="mt-1">Owner</Badge>
        </div>
      </Card>

      {/* ============ PERSONAL INFORMATION ============ */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Personal Information</h3>
        <div className="space-y-3">
          <Input label="Full Name" icon={User} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <div>
            <Input label="Email Address" icon={Mail} value={user?.email || ''} disabled />
            <p className="text-[10px] text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> {user?.is_email_verified ? 'Verified' : 'Not verified'}
            </p>
          </div>
          <div>
            <Input label="Phone Number" icon={Phone} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <p className="text-[10px] text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" /> {user?.is_phone_verified ? 'Verified' : 'Not verified'}
            </p>
          </div>
        </div>
        <Button fullWidth className="mt-4" onClick={handleSaveProfile} isLoading={saving}>
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </Card>

      {/* ============ KYC STATUS ============ */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" /> KYC Verification
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-500">Status</span>
          {kycComplete ? <Badge variant="success" size="sm">Verified</Badge> : <Badge variant="warning" size="sm">Pending</Badge>}
        </div>
        <p className="text-xs text-slate-500 mb-3">
          {kycComplete
            ? 'Your identity is verified. You can list vehicles.'
            : `Complete KYC to unlock vehicle listing. (${approvedDocs.length}/2 verified)`}
        </p>
        <Button size="sm" variant="outline" onClick={() => navigate('/owner/documents')}>View KYC →</Button>
      </Card>

      {/* ============ PAYOUT METHODS ============ */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Banknote className="w-4 h-4 text-green-600" /> Payout Methods
        </h3>

        {payoutMethods.length > 0 ? (
          <div className="space-y-2">
            {payoutMethods.map((method) => (
              <div key={method.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                <Banknote className="w-4 h-4 text-slate-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{method.method}</p>
                  <p className="text-xs text-slate-400">{method.account_number}</p>
                </div>
                {method.is_primary && <Badge variant="success" size="xs">Primary</Badge>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-3">No payout methods added</p>
        )}

        <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate('/owner/payouts')}>
          Manage Payout Methods →
        </Button>
      </Card>

      {/* ============ SECURITY ============ */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-600" /> Security
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Password</p>
          <Button size="sm" variant="outline" onClick={() => setPasswordModal(true)}>Change Password</Button>
        </div>
      </Card>

      {/* ============ ACCOUNT INFO ============ */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Role</span><Badge variant="success" size="sm">Owner</Badge></div>
          <div className="flex justify-between"><span className="text-slate-500">Status</span><StatusBadge status={user?.is_active ? 'active' : 'suspended'} size="sm" /></div>
          <div className="flex justify-between"><span className="text-slate-500">Member Since</span><span className="flex items-center gap-1 text-xs"><Calendar className="w-3 h-3" />{formatDate(user?.created_at || new Date())}</span></div>
        </div>
      </Card>

      {/* ============ DANGER ZONE ============ */}
      <Card className="p-4 border-red-200">
        <h3 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Deactivating will disable your account. Your vehicles will no longer be available for new bookings.
        </p>
        <Button size="sm" variant="danger" onClick={() => setDeactivateModal(true)}>Deactivate Account</Button>
      </Card>

      {/* ============ PASSWORD MODAL ============ */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPasswordModal(false)} />
          <div className="relative bg-white rounded-xl p-5 max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-4">Change Password</h3>
            {passwordError && <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700 mb-3">{passwordError}</div>}
            <div className="space-y-3">
              <Input label="Current Password" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
              <Input label="New Password" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
              <Input label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" fullWidth onClick={() => setPasswordModal(false)}>Cancel</Button>
              <Button size="sm" fullWidth onClick={handleChangePassword} isLoading={passwordLoading}>Update Password</Button>
            </div>
          </div>
        </div>
      )}

      {/* ============ DEACTIVATE MODAL ============ */}
      {deactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeactivateModal(false)} />
          <div className="relative bg-white rounded-xl p-5 max-w-sm w-full mx-4">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">Deactivate Account?</h3>
                <p className="text-xs text-slate-500 mt-1">This will disable your account and hide your vehicles.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" fullWidth onClick={() => setDeactivateModal(false)}>Cancel</Button>
              <Button variant="danger" size="sm" fullWidth onClick={handleDeactivate} isLoading={deactivateLoading}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerSettings;