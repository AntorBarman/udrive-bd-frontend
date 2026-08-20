import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import Vehicles from './pages/public/Vehicles';
import VehicleDetail from './pages/public/VehicleDetail';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Unauthorized from './pages/Unauthorized';

import BookingConfirm from './pages/booking/BookingConfirm';
import BookingPayment from './pages/booking/BookingPayment';
import BookingSuccess from './pages/booking/BookingSuccess';

import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBookings from './pages/customer/Bookings';
import BookingDetails from './pages/customer/BookingDetails';

import OwnerDashboard from './pages/owner/Dashboard';
import OwnerVehicles from './pages/owner/Vehicles';
import OwnerEarnings from './pages/owner/Earnings';

import AdminDashboard from './pages/admin/Dashboard';
import AdminVehicles from './pages/admin/Vehicles';
import VehicleReview from './pages/admin/VehicleReview';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/vehicles" element={<PublicLayout><Vehicles /></PublicLayout>} />
        <Route path="/vehicles/:id" element={<PublicLayout><VehicleDetail /></PublicLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Booking Flow */}
        <Route path="/booking/confirm" element={<BookingConfirm />} />
        <Route path="/booking/payment" element={<BookingPayment />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        
        {/* Customer */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <DashboardLayout role="customer"><CustomerDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <DashboardLayout role="customer"><CustomerBookings /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/bookings/:id" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <DashboardLayout role="customer"><BookingDetails /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Owner */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <DashboardLayout role="owner"><OwnerDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/vehicles" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <DashboardLayout role="owner"><OwnerVehicles /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/earnings" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <DashboardLayout role="owner"><OwnerEarnings /></DashboardLayout>
          </ProtectedRoute>
        } />
        
        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout role="admin"><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/vehicles" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout role="admin"><AdminVehicles /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/vehicles/:id/review" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <DashboardLayout role="admin"><VehicleReview /></DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;