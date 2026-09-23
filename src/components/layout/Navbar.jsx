// frontend/src/components/layout/Navbar.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu, X, Car, ChevronDown, LayoutDashboard, User,
  LogOut, Calendar, Bell, Plus, TrendingUp, HelpCircle,
  Wallet, Shield, MapPin
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { logout } from '../../features/auth/authSlice';
import NotificationBell from '../NotificationBell';

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
  const isHomePage = location.pathname === '/';
  
  // ✅ Transparent navbar only on home page (top)
  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // ✅ User Avatar
  const UserAvatar = ({ size = 'sm' }) => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

    if (user?.avatar_url) {
      return (
        <img
          src={user.avatar_url}
          alt={user?.name || 'User'}
          className={`${sizeClasses} rounded-full object-cover shrink-0 ring-2 ring-white/30`}
          crossOrigin="anonymous"
        />
      );
    }

    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0 ring-2 ring-white/30`}>
        <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} font-bold text-white`}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </span>
      </div>
    );
  };

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: 'Vehicles', path: '/admin/vehicles', icon: Car },
          { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
          { label: 'KYC', path: '/admin/kyc', icon: Shield },
        ];
      case 'owner':
        return [
          { label: 'Dashboard', path: '/owner', icon: LayoutDashboard },
          { label: 'My Vehicles', path: '/owner/vehicles', icon: Car },
          { label: 'Bookings', path: '/owner/bookings', icon: Calendar },
          { label: 'Earnings', path: '/owner/earnings', icon: TrendingUp },
        ];
      case 'customer':
        return [
          { label: 'Cars', path: '/vehicles', icon: Car },
          { label: 'My Bookings', path: '/bookings', icon: Calendar },
          { label: 'Branches', path: '/branches', icon: MapPin },
        ];
      default:
        return [
          { label: 'Home', path: '/', icon: Car },
          { label: 'Cars', path: '/vehicles', icon: Car },
          { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
          { label: 'Become Owner', path: '/become-owner', icon: TrendingUp },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50'
        }`}
      >
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 max-w-[1600px] mx-auto">
            {/* ✅ Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isTransparent 
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20' 
                  : 'bg-blue-600 group-hover:bg-blue-700 shadow-lg shadow-blue-500/20'
              }`}>
                <Car className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-slate-900'
              }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                UDrive<span className="text-blue-500">BD</span>
              </span>
            </Link>

            {/* ✅ Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isTransparent
                        ? active
                          ? 'text-white bg-white/20 backdrop-blur-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                        : active
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

            {/* ✅ Right Side */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <NotificationBell isTransparent={isTransparent} />

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all duration-300 ${
                        isTransparent 
                          ? 'hover:bg-white/10' 
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <UserAvatar size="sm" />
                      <ChevronDown className={`w-4 h-4 transition-colors ${
                        isTransparent ? 'text-white/80' : 'text-slate-500'
                      }`} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                          <UserAvatar size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            <Badge
                              variant={getRoleBadgeVariant(user?.role)}
                              size="xs"
                              className="mt-1 capitalize"
                            >
                              {user?.role}
                            </Badge>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="py-2">
                          {role === 'customer' && (
                            <>
                              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                              </Link>
                              <Link to="/bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                <Calendar className="w-4 h-4 text-slate-400" /> My Bookings
                              </Link>
                              <Link to="/wallet" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                <Wallet className="w-4 h-4 text-slate-400" /> Wallet
                              </Link>
                            </>
                          )}

                          {role === 'owner' && (
                            <>
                              <Link to="/owner" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                              </Link>
                              <Link to="/owner/vehicles" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                <Car className="w-4 h-4 text-slate-400" /> My Vehicles
                              </Link>
                              <Link to="/owner/earnings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                                <TrendingUp className="w-4 h-4 text-slate-400" /> Earnings
                              </Link>
                            </>
                          )}

                          {role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                              <LayoutDashboard className="w-4 h-4 text-slate-400" /> Admin Panel
                            </Link>
                          )}

                          <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <User className="w-4 h-4 text-slate-400" /> Profile Settings
                          </Link>
                        </div>

                        <div className="border-t border-slate-100 pt-2">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block">
                    <button className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      isTransparent
                        ? 'text-white border border-white/30 hover:bg-white/10'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}>
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg ${
                      isTransparent
                        ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-white/20'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                    }`}>
                      Get Started
                    </button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-lg transition-all ${
                  isTransparent ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                }`}
              >
                <Menu className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-slate-700'}`} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ✅ Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white shadow-2xl flex flex-col animate-slideInRight">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">
                  UDrive<span className="text-blue-600">BD</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAuthenticated && (
              <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-slate-50 flex items-center gap-3">
                <UserAvatar size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{user?.name}</p>
                  <Badge variant={getRoleBadgeVariant(user?.role)} size="xs" className="mt-1 capitalize">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            )}

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              <hr className="my-3 border-slate-100" />

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 w-full transition-all"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl border-2 border-slate-200 text-center font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl bg-blue-600 text-center text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;