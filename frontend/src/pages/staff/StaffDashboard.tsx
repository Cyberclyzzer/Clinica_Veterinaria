import { useEffect, useState } from 'react';
import { Clipboard, Calendar, Stethoscope, FileText, Users, PawPrint, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useAppointmentStore from '../../store/appointmentStore';
import Button from '../../components/ui/Button';

const StaffDashboard = () => {
  const { user } = useAuthStore();
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const [todayAppointments, setTodayAppointments] = useState<typeof appointments>([]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    // Filter today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppts = appointments.filter(appointment => {
      const apptDate = new Date(appointment.fecha);
      apptDate.setHours(0, 0, 0, 0);
      return apptDate.getTime() === today.getTime();
    });
    
    setTodayAppointments(todayAppts);
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-gray-500">
          Today is {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Today's Appointments" 
          value={todayAppointments.length.toString()} 
          icon={<Calendar className="h-6 w-6 text-primary-600" />}
          href="/staff/appointments"
        />
        <StatCard 
          title="Pagos Pendientes" 
          value="5" 
          icon={<Receipt className="h-6 w-6 text-purple-500" />}
          href="/staff/pagos"
        />
        <StatCard 
          title="Total Pets" 
          value="42" 
          icon={<PawPrint className="h-6 w-6 text-accent-600" />}
          href="/staff/clients"
        />
        <StatCard 
          title="Total Clients" 
          value="28" 
          icon={<Users className="h-6 w-6 text-success-600" />}
          href="/staff/clients"
        />
      </div>
      
      {/* Today's Appointments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Clipboard className="h-5 w-5 mr-2 text-primary-600" />
              Today's Appointments
            </h2>
            <Link to="/staff/appointments">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="text-center p-6">Loading appointments...</div>
          ) : todayAppointments.length > 0 ? (
            todayAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-gray-900">
                      {/* In a real app, we'd fetch pet & owner data */}
                      Appointment for Pet #{appointment.mascota_id}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.motivo}</p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-start sm:items-end">
                    <div className="text-sm font-medium text-gray-900 mr-2 sm:mr-0">
                      {appointment.hora}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-gray-500">
              No appointments scheduled for today.
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Treatments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-primary-600" />
              Recent Treatments
            </h2>
            <Link to="/staff/treatments">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <p className="font-medium text-gray-900">Skin examination</p>
                <p className="text-sm text-gray-500">Max (Golden Retriever)</p>
              </div>
              <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                {format(new Date(new Date().setDate(new Date().getDate() - 1)), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
          <div className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <p className="font-medium text-gray-900">Vaccination</p>
                <p className="text-sm text-gray-500">Luna (Siamese Cat)</p>
              </div>
              <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                {format(new Date(new Date().setDate(new Date().getDate() - 3)), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  href: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, href }) => {
  return (
    <Link to={href} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StaffDashboard;