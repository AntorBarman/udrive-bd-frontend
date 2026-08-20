import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Shield, 
  Key, 
  Lock, 
  CreditCard,
  Car,
  ChevronRight,
  Star,
  CheckCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Home = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
  });
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchData);
  };
  
  return (
    <div>
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Drive Your Way{' '}
              <span className="text-blue-400">Across Bangladesh</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Rent verified self-drive cars from trusted owners. 
              Affordable, safe, and convenient — no middlemen, no hassle.
            </p>
          </div>
          
          {/* Search Widget */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="bg-white rounded-xl shadow-2xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Pickup Location"
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={searchData.location}
                      onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={searchData.pickupDate}
                      onChange={(e) => setSearchData({...searchData, pickupDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={searchData.returnDate}
                      onChange={(e) => setSearchData({...searchData, returnDate: e.target.value})}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 px-6 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                    Search Cars
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* ============================================
          WHY UDRIVE SECTION
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose UDrive?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We're building Bangladesh's most trusted car rental platform with safety and convenience at the core.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Verified Vehicles</h3>
            <p className="text-sm text-slate-500">Every vehicle undergoes inspection</p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Secure KYC</h3>
            <p className="text-sm text-slate-500">Identity verified owners & renters</p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Secure Payments</h3>
            <p className="text-sm text-slate-500">SSLCommerz protected transactions</p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Flexible Pickup</h3>
            <p className="text-sm text-slate-500">Multiple locations across Dhaka</p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Trusted Owners</h3>
            <p className="text-sm text-slate-500">Community of verified car owners</p>
          </Card>
        </div>
      </section>
      
      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500">Four simple steps to your next journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Search', desc: 'Find the perfect car for your needs' },
              { step: '2', title: 'Choose', desc: 'Select dates and review pricing' },
              { step: '3', title: 'Book', desc: 'Pay securely online' },
              { step: '4', title: 'Drive', desc: 'Pick up your car and go!' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ============================================
          BECOME AN OWNER CTA
          ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Own a Car? Earn Money with UDrive
            </h2>
            <p className="text-blue-100 mb-6">
              List your vehicle on UDrive and earn up to ৳50,000 per month. 
              We handle verification, payments, and bookings.
            </p>
            <Link to="/become-owner">
              <Button variant="secondary" size="lg">
                Become an Owner
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* ============================================
          SECURITY BADGES
          ============================================ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-wrap justify-center gap-6">
            <Badge variant="success" size="lg">
              <CheckCircle className="w-4 h-4 mr-1" /> NID Verified
            </Badge>
            <Badge variant="success" size="lg">
              <CheckCircle className="w-4 h-4 mr-1" /> Vehicle Inspected
            </Badge>
            <Badge variant="success" size="lg">
              <CheckCircle className="w-4 h-4 mr-1" /> Secure Payment
            </Badge>
            <Badge variant="success" size="lg">
              <CheckCircle className="w-4 h-4 mr-1" /> Insurance Available
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;