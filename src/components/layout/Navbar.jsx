import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Menu, 
  X, 
  Car, 
  Search, 
  User, 
  LogOut, 
  ChevronDown,
  LayoutDashboard,
  Wallet,
  Settings,
} from 'lucide-react';
import Button from '../ui/Button';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ Redux থেকে user state
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // ✅ Redux logout dispatch
  const handleLogout = async () => {
    await dispatch(logout());
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };
  
  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-white/95 backdrop-blur-sm border-b border-slate-200'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                UDrive<span className="text-blue-600">BD</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/vehicles" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Vehicles
              </Link>
              <Link to="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                How It Works
              </Link>
              <Link to="/become-owner" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Become an Owner
              </Link>
              <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link to="/help" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Help
              </Link>
            </div>
            
            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {user.name?.[0] || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                      {user.role === 'customer' && (
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      )}
                      
                      {user.role === 'owner' && (
                        <Link
                          to="/owner"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Owner Dashboard
                        </Link>
                      )}
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      
                      <Link
                        to="/wallet"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Wallet className="w-4 h-4" /> Wallet
                      </Link>
                      
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" /> Settings
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
              ) : (
                <>
                  <Link to="/login">
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
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </nav>
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-16" />
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-white shadow-xl">
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
            
            <div className="p-4 space-y-2">
              <Link
                to="/vehicles"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Car className="w-5 h-5" /> Vehicles
              </Link>
              <Link
                to="/how-it-works"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5" /> How It Works
              </Link>
              <Link
                to="/become-owner"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" /> Become an Owner
              </Link>
              
              <hr className="my-2" />
              
              {user ? (
                <>
                  {user.role === 'customer' && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                  )}
                  
                  {user.role === 'owner' && (
                    <Link
                      to="/owner"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" /> Owner Dashboard
                    </Link>
                  )}
                  
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium w-full"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg border border-slate-200 text-center text-slate-700 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 rounded-lg bg-blue-600 text-center text-white font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;