import { Link } from 'react-router-dom';
import { Car, Shield, Lock, CreditCard, CheckCircle } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              UDrive<span className="text-blue-600">BD</span>
            </span>
          </Link>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-500 mb-8">{subtitle}</p>
          
          {/* Content */}
          {children}
        </div>
      </div>
      
      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-900 text-white p-12 flex-col justify-between">
        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Drive Your Way<br />Across Bangladesh
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Join thousands of satisfied customers and trusted owners.
          </p>
        </div>
        
        <div className="space-y-4">
          {[
            { icon: Shield, text: 'Verified Vehicles & Owners' },
            { icon: Lock, text: 'Secure KYC Process' },
            { icon: CreditCard, text: 'SSLCommerz Payments' },
            { icon: CheckCircle, text: '24/7 Support' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-blue-100">{item.text}</span>
              </div>
            );
          })}
        </div>
        
        <p className="text-blue-300 text-sm">
          © 2026 UDrive Bangladesh
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;