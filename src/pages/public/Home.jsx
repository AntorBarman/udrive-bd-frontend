// frontend/src/pages/public/Home.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Calendar, Shield, Key, Lock, CreditCard,
  Car, ChevronRight, Star, CheckCircle, Clock, ArrowRight,
  Quote, Sparkles, TrendingUp, Play
} from 'lucide-react';
import Card from '../../components/ui/Card';
import api from '../../services/api';
import reviewService from '../../services/reviewService';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatters';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const Home = () => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
  });
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
    fetchRecentReviews();
  }, []);

  const fetchHomeData = async () => {
    try {
      const vehiclesRes = await api.get('/vehicles?limit=6');
      setFeaturedVehicles(vehiclesRes.data?.data || vehiclesRes.data || []);

      const branchesRes = await api.get('/branches');
      setBranches(branchesRes.data?.data || branchesRes.data || []);
    } catch (error) {
      setFeaturedVehicles([]);
      setBranches([]);
    }
  };

  const fetchRecentReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await reviewService.getRecentReviews(3);
      setRecentReviews(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setRecentReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.pickupDate) params.append('pickupDate', searchData.pickupDate);
    if (searchData.returnDate) params.append('returnDate', searchData.returnDate);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* ============================================ */}
      {/* ✅ FULL-WIDTH HERO SECTION (FIXED) */}
      {/* ============================================ */}
      <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=2400')`,
          }}
        />

        {/* ✅ Balanced Overlay - Text Readable, Image Visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left: Text Content */}
            <div className="lg:col-span-7 max-w-2xl">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-white text-sm font-medium">
                  Bangladesh's #1 Car Rental Platform
                </span>
              </motion.div>

              {/* Heading with Text Shadow */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6 tracking-tight"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)'
                }}
              >
                Fast & Easy
                <br />
                Way To{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Rent A Car
                </span>
              </motion.h1>

              {/* Subtitle with Shadow */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-white mb-10 max-w-xl leading-relaxed"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
              >
                Verified cars. Trusted owners. Your journey, your way.
                Experience premium self-drive car rental across Bangladesh.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 mb-12"
              >
                <Link to="/vehicles">
                  <button className="group bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-emerald-500/40 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Browse Cars
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <button className="group flex items-center gap-3 text-white font-semibold">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                  <span
                    className="text-lg"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                  >
                    How it works
                  </span>
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap items-center gap-8 text-white"
              >
                <div>
                  <p className="text-3xl font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    500+
                  </p>
                  <p className="text-slate-100 text-sm" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                    Verified Cars
                  </p>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <p className="text-3xl font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    10K+
                  </p>
                  <p className="text-slate-100 text-sm" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                    Happy Customers
                  </p>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div>
                  <p className="text-3xl font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    4.9★
                  </p>
                  <p className="text-slate-100 text-sm" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
                    Average Rating
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right side for image visibility */}
            <div className="lg:col-span-5 hidden lg:block"></div>
          </div>

          {/* Search Widget */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 max-w-5xl"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/20">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 z-10" />
                  <select
                    value={searchData.location}
                    onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="">Pickup Location</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.city}>{branch.city}</option>
                    ))}
                  </select>
                </div>

                {/* Pickup Date */}
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 z-10" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    value={searchData.pickupDate}
                    onChange={(e) => setSearchData({ ...searchData, pickupDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Return Date */}
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 z-10" />
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    value={searchData.returnDate}
                    onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                    min={searchData.pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl py-4 px-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/30"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ✅ POPULAR CARS */}
      {/* ============================================ */}
      <motion.section {...fadeInUp} className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-3">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                  Trending Now
                </span>
              </div>
              <h2
                className="text-3xl md:text-5xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Popular Cars Near You
              </h2>
              <p className="text-slate-500 text-lg">
                Verified vehicles ready for your next trip
              </p>
            </div>
            <Link
              to="/vehicles"
              className="group text-emerald-600 text-sm font-semibold hover:text-emerald-700 flex items-center gap-1 mt-4 md:mt-0"
            >
              View All Cars
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.slice(0, 6).map((vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/vehicles/${vehicle.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                  <div className="relative h-60 overflow-hidden bg-slate-100">
                    {vehicle.primary_image ? (
                      <img
                        src={vehicle.primary_image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-16 h-16 text-slate-300" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wider shadow-md">
                      {vehicle.vehicle_type}
                    </span>

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-800">
                        {Number(vehicle.average_rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {vehicle.year} • {vehicle.branch_name || 'Available'}
                    </p>

                    <div className="flex justify-between items-end pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                          Starting at
                        </span>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(vehicle.daily_rate)}
                          <span className="text-sm font-normal text-slate-400">/day</span>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-emerald-500 flex items-center justify-center transition-all">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="py-16 text-center">
              <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No vehicles available yet</p>
            </Card>
          )}
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* ✅ WHY CHOOSE US */}
      {/* ============================================ */}
      <motion.section {...fadeInUp} className="py-24 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Why Choose UDrive?
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Built on trust, safety, and convenience. We provide the best car rental experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Verified Vehicles', desc: 'Every vehicle is thoroughly reviewed and verified before rental.', color: 'blue' },
              { icon: Key, title: 'Secure KYC', desc: 'Identity verification for owners and renters for maximum safety.', color: 'emerald' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'SSLCommerz protected transactions with multiple payment options.', color: 'purple' },
              { icon: Clock, title: 'Flexible Pickup', desc: 'Multiple locations across Bangladesh for your convenience.', color: 'amber' },
            ].map((item, index) => {
              const colors = {
                blue: 'bg-blue-50 text-blue-600',
                emerald: 'bg-emerald-50 text-emerald-600',
                purple: 'bg-purple-50 text-purple-600',
                amber: 'bg-amber-50 text-amber-600',
              };
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group text-center p-8 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${colors[item.color]} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* ✅ HOW IT WORKS - Dark Premium */}
      {/* ============================================ */}
      <motion.section {...fadeInUp} className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2"></div>
        </div>

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              How It Works
            </h2>
            <p className="text-lg text-slate-400">Four simple steps to your next journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>

            {[
              { step: '01', title: 'Search', desc: 'Find the perfect car for your needs' },
              { step: '02', title: 'Choose', desc: 'Select dates and review pricing' },
              { step: '03', title: 'Book', desc: 'Pay securely with SSLCommerz' },
              { step: '04', title: 'Drive', desc: 'Pick up your car and go!' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative text-center z-10"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* ✅ BRANCHES */}
      {/* ============================================ */}
      <motion.section {...fadeInUp} className="py-24 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2
                className="text-3xl md:text-5xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Pickup Locations
              </h2>
              <p className="text-lg text-slate-500">Find a UDrive location near you</p>
            </div>
            <Link
              to="/branches"
              className="group text-emerald-600 text-sm font-semibold hover:text-emerald-700 flex items-center gap-1 mt-4 md:mt-0"
            >
              View All Locations
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.slice(0, 3).map((branch) => (
                <motion.div
                  key={branch.id}
                  whileHover={{ y: -4 }}
                  className="group bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:border-emerald-200 transition-all"
                >
                  <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                    <MapPin className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{branch.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{branch.address}</p>
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                    {branch.city}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="py-16 text-center">
              <p className="text-slate-500">Locations coming soon</p>
            </Card>
          )}
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* ✅ BECOME OWNER CTA */}
      {/* ============================================ */}
      <motion.section {...fadeInUp} className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-8 md:p-20 text-white text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">Start Earning Today</span>
              </div>

              <h2
                className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl mx-auto leading-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Turn Your Car Into an{' '}
                <span className="text-emerald-400">Income Source</span>
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
                List your vehicle on UDrive, get verified, and start earning up to ৳50,000 per month.
              </p>
              <Link to="/become-owner">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-emerald-500/30 inline-flex items-center gap-2">
                  Become a UDrive Owner
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* ✅ TESTIMONIALS */}
      {/* ============================================ */}
      <motion.section {...fadeInUp} className="py-24 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              What Our Customers Say
            </h2>
            <p className="text-lg text-slate-500">Real experiences from verified renters</p>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : recentReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100"
                >
                  <Quote className="w-10 h-10 text-emerald-500/20 mb-4" />

                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                      />
                    ))}
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed italic">
                    "{review.comment}"
                  </p>

                  {review.brand && (
                    <p className="text-xs text-emerald-600 font-semibold mb-4 uppercase tracking-wider">
                      {review.brand} {review.model}
                    </p>
                  )}

                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {review.customer_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{review.customer_name}</p>
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified Customer
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="py-16 text-center">
              <Quote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No reviews yet. Be the first to review!</p>
            </Card>
          )}
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* ✅ FAQ */}
      {/* ============================================ */}
      <motion.section {...fadeInUp} className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-500">Common questions about renting with UDrive</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Do I need a driving license?', a: 'Yes. A valid driving license is required for self-drive rentals.' },
              { q: 'Is a security deposit required?', a: 'Yes, depending on the vehicle and booking details. The deposit is fully refundable after the trip.' },
              { q: 'Can I cancel my booking?', a: 'Yes, cancellation is allowed with a flexible refund policy depending on how far in advance you cancel.' },
              { q: 'Are the vehicles verified?', a: 'Absolutely. Every vehicle goes through rigorous document and inspection verification before listing.' },
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl p-6 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2">{faq.q}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============================================ */}
      {/* ✅ FINAL CTA */}
      {/* ============================================ */}
      <section className="bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-28 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ready to Hit the Road?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mb-10 text-lg max-w-xl mx-auto"
          >
            Find a verified self-drive car for your next journey. Book in minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/vehicles">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-emerald-500/30 inline-flex items-center gap-2">
                <Car className="w-5 h-5" />
                Browse Cars Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;