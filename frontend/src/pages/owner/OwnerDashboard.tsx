import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PawPrint, Calendar, FileText, Clock, Receipt } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import usePetStore from '../../store/petStore';
import useAppointmentStore from '../../store/appointmentStore';
import usePagoStore from '../../store/pagoStore';
import { EstadoPago } from '../../types/index';
import Button from '../../components/ui/Button';

const OwnerDashboard = () => {
  const { user } = useAuthStore();
  const { pets, fetchPetsByOwner } = usePetStore();
  const { appointments, fetchAppointmentsByOwner } = useAppointmentStore();
  const { pagos, fetchPagos } = usePagoStore();

  useEffect(() => {
    if (user) {
      fetchPetsByOwner(user.id);
      fetchAppointmentsByOwner(user.id);
      fetchPagos();
    }
  }, [user, fetchPetsByOwner, fetchAppointmentsByOwner, fetchPagos]);

  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter(
    (appointment) => new Date(appointment.fecha) > new Date()
  ).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  // Filter for pending pagos
  const pendingPagos = pagos.filter(
    (pago) => pago.estado === EstadoPago.PENDIENTE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.name || 'Pet Owner'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link to="/owner/appointments/new">
            <Button variant="primary" size="sm">
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<PawPrint className="h-6 w-6 text-primary-600" />}
          title="My Pets"
          value={pets.length.toString()}
          href="/owner/pets"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6 text-secondary-600" />}
          title="Upcoming Appointments"
          value={upcomingAppointments.length.toString()}
          href="/owner/appointments"
        />
        <StatCard
          icon={<Receipt className="h-6 w-6 text-purple-500" />}
          title="Pagos Pendientes"
          value={pendingPagos.length.toString()}
          href="/owner/pagos"
        />
      </div>
      
      {/* My Pets Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <PawPrint className="h-5 w-5 mr-2 text-primary-600" />
              My Pets
            </h2>
            <Link to="/owner/pets">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  {pet.photo ? (
                    <img 
                      src={pet.photo} 
                      alt={pet.nombre} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <PawPrint className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{pet.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {pet.raza || pet.especie}, {new Date().getFullYear() - pet.fecha_nacimiento.getFullYear()} años
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-4 text-gray-500">
              No pets registered yet.
            </div>
          )}
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary-600" />
              Upcoming Appointments
            </h2>
            <Link to="/owner/appointments">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => {
              // Find the pet for this appointment
              const pet = pets.find(p => p.id === appointment.mascota_id);
              
              return (
                <div key={appointment.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {pet?.nombre || `Pet #${appointment.mascota_id}`}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.motivo}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col items-end">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(appointment.fecha), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.hora}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-6 text-gray-500">
              No upcoming appointments.
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Pagos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Pagos Recientes
            </h2>
            <Link to="/owner/pagos">
              <Button variant="outline" size="sm">
                Ver Todos
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pagos.length > 0 ? (
            pagos.slice(0, 3).map((pago) => {
              // Para un dashboard real, aquí relacionaríamos el pago con la mascota
              // a través de la cita asociada
              return (
                <div key={pago.id} className="p-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Pago #{pago.id.substring(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cita #{pago.cita_id}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col items-end">
                      <p className="text-sm font-medium text-gray-900">
                        ${pago.monto_total.toFixed(2)}
                      </p>
                      <EstadoPagoBadge estado={pago.estado} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-6 text-gray-500">
              No se encontraron pagos.
            </div>
          )}
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

interface StatusBadgeProps {
  estado: EstadoPago;
}

const EstadoPagoBadge: React.FC<StatusBadgeProps> = ({ estado }) => {
  const estadoStyles = {
    [EstadoPago.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
    [EstadoPago.COMPLETADO]: 'bg-green-100 text-green-800',
    [EstadoPago.CANCELADO]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoStyles[estado]}`}>
      {estado}
    </span>
  );
};

export default OwnerDashboard;