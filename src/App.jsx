import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CustomerLayout from './layouts/CustomerLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';
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
import CustomerKYC from './pages/customer/KYC';  // ✅ Import

import OwnerDashboard from './pages/owner/Dashboard';
import OwnerVehicles from './pages/owner/Vehicles';
import OwnerEarnings from './pages/owner/Earnings';
import AddVehicle from './pages/owner/AddVehicle';
import EditVehicle from './pages/owner/EditVehicle';
import OwnerDocuments from './pages/owner/Documents';

import AdminDashboard from './pages/admin/Dashboard';
import AdminVehicles from './pages/admin/Vehicles';
import VehicleReview from './pages/admin/VehicleReview';
import AdminKYC from './pages/admin/KYC';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Booking */}
        <Route path="/booking/confirm" element={<BookingConfirm />} />
        <Route path="/booking/payment" element={<BookingPayment />} />
        <Route path="/booking/success" element={<BookingSuccess />} />

        {/* Customer */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout><CustomerDashboard /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout><CustomerBookings /></CustomerLayout>
          </ProtectedRoute>
        } />
        <Route path="/bookings/:id" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout><BookingDetails /></CustomerLayout>
          </ProtectedRoute>
        } />
        {/* ✅ KYC Route */}
        <Route path="/kyc" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout><CustomerKYC /></CustomerLayout>
          </ProtectedRoute>
        } />

        {/* Owner */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerLayout><OwnerDashboard /></OwnerLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/vehicles" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerLayout><OwnerVehicles /></OwnerLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/vehicles/new" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerLayout><AddVehicle /></OwnerLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/vehicles/:id/edit" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerLayout><EditVehicle /></OwnerLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/earnings" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerLayout><OwnerEarnings /></OwnerLayout>
          </ProtectedRoute>
        } />
        <Route path="/owner/documents" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerLayout><OwnerDocuments /></OwnerLayout>
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/vehicles" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <AdminLayout><AdminVehicles /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/vehicles/:id/review" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <AdminLayout><VehicleReview /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/kyc" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <AdminLayout><AdminKYC /></AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;