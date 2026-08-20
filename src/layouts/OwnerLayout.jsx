import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Wallet,
  Plus,
  FileText,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Badge from '../components/ui/Badge';
import api from '../services/api';

const OwnerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [kycApproved, setKycApproved] = useState(false);
  const userMenuRef = useRef(null);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Check KYC status
  useEffect(() => {
    checkKycStatus();
  }, []);
  
  const checkKycStatus = async () => {
    try {
      const response = await api.get('/documents/my');
      const docs = response.data.data || [];
      const approvedCount = docs.filter((d) => d.status === 'approved').length;
      setKycApproved(approvedCount >= 2);
    } catch (error) {
      console.warn('KYC check failed:', error.message);
      setKycApproved(false);
    }
  };
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/owner', locked: false },
    { icon: Car, label: 'My Fleet', path: '/owner/vehicles', locked: false },
    { icon: Plus, label: 'Add Vehicle', path: '/owner/vehicles/new', locked: !kycApproved },
    { icon: Calendar, label: 'Rental Orders', path: '/owner/bookings', locked: false },
    { icon: Wallet, label: 'Wallet & Payouts', path: '/owner/earnings', locked: false },
    { icon: FileText, label: 'KYC & Documents', path: '/owner/documents', locked: false },
  ];
  
  const isActive = (path) => 
    location.pathname === path || location.pathname.startsWith(path + '/');
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  const SidebarContent = () => (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            UDrive<span className="text-green-600">BD</span>
          </span>
        </Link>
      </div>
      
      {/* KYC Status Banner */}
      {!kycApproved && (
        <div className="p-3 border-b border-yellow-200 bg-yellow-50">
          <Link to="/owner/documents" className="flex items-center gap-2 text-xs text-yellow-700">
            <Lock className="w-3 h-3" />
            KYC pending — complete verification
          </Link>
        </div>
      )}
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.locked ? '/owner/documents' : item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-green-50 text-green-600'
                  : 'text-slate-600 hover:bg-slate-50'
              } ${item.locked ? 'opacity-50' : ''}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
              {item.locked && <Lock className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </div>
      
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0">
            <SidebarContent />
          </div>
        </div>
      )}
      
      <div className="lg:ml-64">
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <p className="font-semibold text-slate-900">
              {navItems.find((item) => isActive(item.path))?.label || 'Owner Dashboard'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600">
                    {user?.name?.[0]?.toUpperCase() || 'O'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <Badge variant="success" size="sm" className="mt-2">Owner</Badge>
                  </div>
                  
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    <User className="w-4 h-4" /> Profile Settings
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    <Settings className="w-4 h-4" /> Account Settings
                  </Link>
                  <Link to="/help" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    <HelpCircle className="w-4 h-4" /> Help Center
                  </Link>
                  
                  <hr className="my-1" />
                  
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;