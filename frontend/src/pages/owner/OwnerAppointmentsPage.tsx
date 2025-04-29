import { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import { Calendar, Clock, PawPrint } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useAppointmentStore from '../../store/appointmentStore';
import usePetStore from '../../store/petStore';
import Button from '../../components/ui/Button';
import RequestAppointmentForm from '../../components/appointment/RequestAppointmentForm';

const OwnerAppointmentsPage = () => {
  const { user } = useAuthStore();
  const { appointments, fetchAppointmentsByOwner, loading } = useAppointmentStore();
  const { pets, fetchPetsByOwner } = usePetStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointmentsByOwner(user.id);
      fetchPetsByOwner(user.id);
    }
  }, [user, fetchAppointmentsByOwner, fetchPetsByOwner]);

  // Función segura para formatear fechas
  const formatDateSafe = (dateValue: any, formatString: string, fallback: string = 'Invalid date'): string => {
    try {
      const date = new Date(dateValue);
      return isValid(date) ? format(date, formatString) : fallback;
    } catch (error) {
      console.error('Error formatting date:', error);
      return fallback;
    }
  };

  // Filter and sort appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppointments = appointments
    .filter(appointment => {
      try {
        const appointmentDate = new Date(appointment.fecha);
        return isValid(appointmentDate) && appointmentDate >= today;
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        if (!isValid(dateA) || !isValid(dateB)) return 0;
        return dateA.getTime() - dateB.getTime();
      } catch (error) {
        return 0;
      }
    });
  
  const pastAppointments = appointments
    .filter(appointment => {
      try {
        const appointmentDate = new Date(appointment.fecha);
        return isValid(appointmentDate) && appointmentDate < today;
      } catch (error) {
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        if (!isValid(dateA) || !isValid(dateB)) return 0;
        return dateB.getTime() - dateA.getTime();
      } catch (error) {
        return 0;
      }
    });
  
  // Get pet name by ID
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.nombre : `Pet #${petId}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Appointments</h1>
        <Button onClick={() => setShowRequestForm(true)}>
          Request Appointment
        </Button>
      </div>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'upcoming' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'past' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading appointments...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {activeTab === 'upcoming' ? (
            upcomingAppointments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="flex items-start space-x-4">
                        <div className="bg-primary-100 rounded-full p-2">
                          <PawPrint className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {getPetName(appointment.mascota_id)}
                          </h3>
                          <p className="text-gray-600">{appointment.motivo}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatDateSafe(appointment.fecha, 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {appointment.hora}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming appointments</h3>
                <p className="mt-1 text-gray-500">You don't have any scheduled appointments.</p>
                <div className="mt-6">
                  <Button onClick={() => setShowRequestForm(true)}>
                    Request Appointment
                  </Button>
                </div>
              </div>
            )
          ) : (
            pastAppointments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 rounded-full p-2">
                          <PawPrint className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {getPetName(appointment.mascota_id)}
                          </h3>
                          <p className="text-gray-600">{appointment.motivo}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatDateSafe(appointment.fecha, 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {appointment.hora}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No past appointments</h3>
                <p className="mt-1 text-gray-500">You don't have any past appointments.</p>
              </div>
            )
          )}
        </div>
      )}

      {showRequestForm && (
        <RequestAppointmentForm
          onClose={() => setShowRequestForm(false)}
          onSuccess={() => {
            if (user) {
              fetchAppointmentsByOwner(user.id);
            }
          }}
        />
      )}
    </div>
  );
};

export default OwnerAppointmentsPage;