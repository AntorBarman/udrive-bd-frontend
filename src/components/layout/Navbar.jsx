import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Menu, 
  X, 
  Car, 
  ChevronDown,
  LayoutDashboard,
  Wallet,
  User,
  LogOut,
  Calendar,
  Settings,
  Shield,
  FileText,
  Users,
  Bell,
  Plus,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const isAuthenticated = !!user;
  const role = user?.role || 'public';
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = async () => {
    await dispatch(logout());
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Role-based nav links
  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: 'Vehicles', path: '/admin/vehicles', icon: Car },
          { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
          { label: 'Payments', path: '/admin/payments', icon: Wallet },
          { label: 'Users', path: '/admin/users', icon: Users },
        ];
      case 'owner':
        return [
          { label: 'Dashboard', path: '/owner', icon: LayoutDashboard },
          { label: 'My Vehicles', path: '/owner/vehicles', icon: Car },
          { label: 'Add Vehicle', path: '/owner/vehicles/new', icon: Plus },
          { label: 'Earnings', path: '/owner/earnings', icon: TrendingUp },
        ];
      case 'customer':
        return [
          { label: 'Vehicles', path: '/vehicles', icon: Car },
          { label: 'My Bookings', path: '/bookings', icon: Calendar },
          { label: 'Wallet', path: '/wallet', icon: Wallet },
        ];
      default:
        return [
          { label: 'Vehicles', path: '/vehicles', icon: Car },
          { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
          { label: 'Become Owner', path: '/become-owner', icon: Car },
        ];
    }
  };
  
  const navLinks = getNavLinks();
  
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'owner': return 'success';
      case 'customer': return 'primary';
      default: return 'default';
    }
  };
  
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-white/95 backdrop-blur-sm border-b border-slate-200'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                UDrive<span className="text-blue-600">BD</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            {/* Right Side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="hidden sm:flex p-2 hover:bg-slate-100 rounded-lg relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                  
                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-slate-900 leading-tight">
                          {user.name?.split(' ')[0]}
                        </p>
                        <p className="text-xs text-slate-500 capitalize leading-tight">
                          {user.role}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </button>
                    
                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <Badge variant={getRoleBadgeVariant(user.role)} size="sm" className="mt-2">
                            {user.role}
                          </Badge>
                        </div>
                        
                        {/* Links */}
                        {role === 'customer' && (
                          <>
                            <Link
                              to="/dashboard"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                            <Link
                              to="/bookings"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Calendar className="w-4 h-4" /> My Bookings
                            </Link>
                          </>
                        )}
                        
                        {role === 'owner' && (
                          <>
                            <Link
                              to="/owner"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                            <Link
                              to="/owner/vehicles"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Car className="w-4 h-4" /> My Vehicles
                            </Link>
                          </>
                        )}
                        
                        {role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        
                        <Link
                          to="/wallet"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Wallet className="w-4 h-4" /> Wallet
                        </Link>
                        
                        <hr className="my-1" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      Register
                    </Button>
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-slate-700" />
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Spacer */}
      <div className="h-16" />
      
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">UDrive<span className="text-blue-600">BD</span></span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            {/* User Info */}
            {isAuthenticated && (
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            
            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <hr className="my-2" />
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg border border-slate-200 text-center text-slate-700 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg bg-blue-600 text-center text-white font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;