import { Outlet, useLocation } from 'react-router-dom';
import { Navbar, Footer, BackButton, Breadcrumbs } from '../components';

const MainLayout = () => {
  const location = useLocation();
  const { pathname } = location;

  const isHomePage = pathname === '/';

  const showBackButton = 
    pathname.includes('/vehicles/') ||
    pathname.includes('/bookings/');

  const showBreadcrumbs = 
    pathname.startsWith('/vehicles');

  return (
    <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 w-full">
        {isHomePage ? (
          <Outlet />  /* ✅ Home page - Full width */
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            {showBreadcrumbs && <Breadcrumbs />}
            {showBackButton && <BackButton className="mb-4" />}
            <Outlet />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;