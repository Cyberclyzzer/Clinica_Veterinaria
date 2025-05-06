import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useAuthStore from '../../store/authStore';
import { UserRole } from '../../types';

const Layout = () => {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    // Ensure user data is loaded
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);
  
  // Determine if this is the staff or pet owner layout
  const isStaff = user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar isStaff={true} />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;