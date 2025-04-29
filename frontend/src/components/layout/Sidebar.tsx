import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Stethoscope, 
  FileText, 
  Users, 
  Home, 
  PawPrint, 
  LayoutDashboard,
  FileCheck
} from 'lucide-react';

interface SidebarProps {
  isStaff: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isStaff }) => {
  // Define navigation items based on user role
  const navItems = isStaff 
    ? [
        { name: 'Dashboard', path: '/staff', icon: <LayoutDashboard size={20} /> },
        { name: 'Appointments', path: '/staff/appointments', icon: <Calendar size={20} /> },
        { name: 'Treatments', path: '/staff/treatments', icon: <Stethoscope size={20} /> },
        { name: 'Pagos', path: '/staff/pagos', icon: <FileText size={20} /> },
      ]
    : [
        { name: 'Dashboard', path: '/owner', icon: <Home size={20} /> },
        { name: 'My Pets', path: '/owner/pets', icon: <PawPrint size={20} /> },
        { name: 'Appointments', path: '/owner/appointments', icon: <Calendar size={20} /> },
        { name: 'Pagos', path: '/owner/pagos', icon: <FileCheck size={20} /> },
      ];

  return (
    <div className="hidden md:block w-64 bg-white shadow-sm">
      <div className="h-full p-4">
        <div className="space-y-8">
          <div>
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {isStaff ? 'Clinic Management' : 'Pet Owner'}
            </p>
            <nav className="mt-5 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`
                  }
                  end={item.path === '/staff' || item.path === '/owner'}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;