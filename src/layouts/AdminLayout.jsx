import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Wallet,
  Users,
  Shield,
  TrendingUp,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Badge from '../components/ui/Badge';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Car, label: 'Vehicle Approvals', path: '/admin/vehicles' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: Wallet, label: 'Payments', path: '/admin/payments' },
    { icon: Users, label: 'Manage Users', path: '/admin/users' },
    { icon: Shield, label: 'KYC Reviews', path: '/admin/kyc' },
    { icon: TrendingUp, label: 'Reports', path: '/admin/reports' },
  ];
  
  const isActive = (path) => 
    location.pathname === path || location.pathname.startsWith(path + '/');
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  const SidebarContent = () => (
    <aside className="w-64 bg-slate-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">UDrive<span className="text-blue-400">BD</span></span>
        </Link>
        <Badge variant="danger" size="sm">Admin</Badge>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:bg-red-900/50 px-3 py-2 rounded-lg w-full">
          <LogOut className="w-4 h-4" /> Logout
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
              {navItems.find((item) => isActive(item.path))?.label || 'Admin Dashboard'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">{user?.name?.[0]?.toUpperCase() || 'A'}</span>
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <Badge variant="danger" size="sm" className="mt-2">Admin</Badge>
                  </div>
                  
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    <User className="w-4 h-4" /> Profile Settings
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    <Settings className="w-4 h-4" /> System Settings
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

export default AdminLayout;