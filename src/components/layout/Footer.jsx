import { Link } from 'react-router-dom';
import { 
  Car,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  CreditCard,
  Globe,
  MessageCircle,
  Share2,
  Users,
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                UDrive<span className="text-blue-400">BD</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm mb-6 max-w-sm">
              Bangladesh's trusted peer-to-peer self-drive car rental platform. 
              Rent verified vehicles from trusted owners across the country.
            </p>
            
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors" aria-label="Facebook">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors" aria-label="Twitter">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors" aria-label="Instagram">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors" aria-label="LinkedIn">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/vehicles" className="text-slate-400 hover:text-white text-sm transition-colors">Browse Vehicles</Link></li>
              <li><Link to="/how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link></li>
              <li><Link to="/become-owner" className="text-slate-400 hover:text-white text-sm transition-colors">Become an Owner</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/help" className="text-slate-400 hover:text-white text-sm transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+8801700000000" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4" /> +880 1700-000000
                </a>
              </li>
              <li>
                <a href="mailto:support@udrivebd.com" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4" /> support@udrivebd.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" /> Banani, Dhaka, Bangladesh
              </li>
            </ul>
          </div>
          
          {/* Trust & Security */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase">Trust & Security</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4 text-green-400" /> Verified Vehicles
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Lock className="w-4 h-4 text-green-400" /> Secure KYC
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <CreditCard className="w-4 h-4 text-green-400" /> SSLCommerz Payments
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-slate-500 text-sm">
              © 2026 UDrive Bangladesh. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/refund" className="text-slate-500 hover:text-white text-sm transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;