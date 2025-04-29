import React from 'react';
import { useEffect, useState } from 'react';
import { format, isValid, isPast, parseISO, isToday } from 'date-fns';
import { Calendar, PawPrint, Check } from 'lucide-react';
import useAppointmentStore from '../../store/appointmentStore';
import usePetStore from '../../store/petStore';
import useTreatmentStore from '../../store/treatmentStore';
import useCitaTratamientoStore from '../../store/citaTratamientoStore';
import usePagoStore from '../../store/pagoStore';
import { Appointment, CitaTratamiento, EstadoPago, MetodoPago, Treatment } from '../../types';
import Button from '../../components/ui/Button';

// Componente para el formulario de finalización de cita
interface FinalizarCitaModalProps {
  cita: Appointment;
  treatments: Treatment[];
  onClose: () => void;
  onSuccess: () => void;
}

const FinalizarCitaModal: React.FC<FinalizarCitaModalProps> = ({ 
  cita, 
  treatments, 
  onClose, 
  onSuccess 
}) => {
  const [selectedTreatments, setSelectedTreatments] = useState<{id: string, cantidad: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const { crearCitaTratamiento } = useCitaTratamientoStore();
  const { crearPago } = usePagoStore();

  const handleAddTreatment = () => {
    setSelectedTreatments([...selectedTreatments, { id: '', cantidad: 1 }]);
  };

  const handleRemoveTreatment = (index: number) => {
    const newTreatments = [...selectedTreatments];
    newTreatments.splice(index, 1);
    setSelectedTreatments(newTreatments);
  };

  const handleTreatmentChange = (index: number, treatmentId: string) => {
    const newTreatments = [...selectedTreatments];
    newTreatments[index].id = treatmentId;
    setSelectedTreatments(newTreatments);
  };

  const handleQuantityChange = (index: number, cantidad: number) => {
    const newTreatments = [...selectedTreatments];
    newTreatments[index].cantidad = cantidad;
    setSelectedTreatments(newTreatments);
  };

  const calculateSubtotal = (treatmentId: string, cantidad: number): number => {
    const treatment = treatments.find(t => t.id === treatmentId);
    if (!treatment) return 0;
    return treatment.costo * cantidad;
  };

  const calculateTotal = (): number => {
    return selectedTreatments.reduce((total, item) => {
      return total + calculateSubtotal(item.id, item.cantidad);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTreatments.length === 0) {
      alert('Debe seleccionar al menos un tratamiento');
      return;
    }

    try {
      setLoading(true);
      
      // Crear registros de CitaTratamiento para cada tratamiento seleccionado
      const citaTratamientosPromises = selectedTreatments.map(item => {
        const subtotal = calculateSubtotal(item.id, item.cantidad);
        
        const citaTratamientoData: Omit<CitaTratamiento, 'id'> = {
          cita_id: cita.id,
          tratamiento_id: item.id,
          cantidad: item.cantidad,
          subtotal: subtotal
        };
        
        return crearCitaTratamiento(citaTratamientoData);
      });
      
      await Promise.all(citaTratamientosPromises);
      
      // Crear pago para la cita
      const totalAmount = calculateTotal();
      
      await crearPago({
        cita_id: cita.id,
        monto_total: totalAmount,
        fecha_pago: new Date(),
        metodo: MetodoPago.EFECTIVO, // Por defecto
        estado: EstadoPago.PENDIENTE
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error al finalizar cita:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Finalizar Cita</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Detalles de la cita</h3>
            <p className="text-sm text-gray-600">Fecha: {format(new Date(cita.fecha), 'dd/MM/yyyy')}</p>
            <p className="text-sm text-gray-600">Hora: {cita.hora}</p>
            <p className="text-sm text-gray-600">Motivo: {cita.motivo}</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Tratamientos realizados</h3>
              <button
                type="button"
                onClick={handleAddTreatment}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                + Agregar tratamiento
              </button>
            </div>

            {selectedTreatments.length === 0 && (
              <p className="text-sm text-gray-500 italic mb-2">
                No hay tratamientos seleccionados
              </p>
            )}

            {selectedTreatments.map((item, index) => (
              <div key={index} className="mb-3 p-3 border rounded-md">
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tratamiento
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveTreatment(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
                <select
                  value={item.id}
                  onChange={(e) => handleTreatmentChange(index, e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm mb-2"
                  required
                >
                  <option value="">Seleccionar tratamiento</option>
                  {treatments.map((treatment) => (
                    <option key={treatment.id} value={treatment.id}>
                      {treatment.descripcion} - ${treatment.costo.toFixed(2)}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                      className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm"
                      required
                    />
                  </div>
                  
                  {item.id && (
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                      <p className="text-sm font-semibold">
                        ${calculateSubtotal(item.id, item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedTreatments.length === 0}
              isLoading={loading}
            >
              Finalizar y Generar Pago
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AppointmentsPage = () => {
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const { pets, fetchPets } = usePetStore();
  const { treatments, fetchTreatments } = useTreatmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentCita, setCurrentCita] = useState<Appointment | null>(null);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchPets();
    fetchTreatments();
  }, [fetchAppointments, fetchPets, fetchTreatments]);

  // Helper to get pet name
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.nombre : `Pet #${petId}`;
  };

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

  // Funciones filtrado y búsqueda
  const filteredAppointments = appointments.filter(appointment => {
    if (!appointment.mascota_id || !appointment.motivo) return false;

    const petName = getPetName(appointment.mascota_id);
    const appointmentReason = appointment.motivo;
    
    const matchesSearch = petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointmentReason.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter) {
      try {
        const appointmentDate = new Date(appointment.fecha);
        if (isValid(appointmentDate)) {
          matchesDate = formatDateSafe(appointmentDate, 'yyyy-MM-dd') === dateFilter;
        } else {
          matchesDate = false;
        }
      } catch (error) {
        console.error('Error matching date:', error);
        matchesDate = false;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  // Ordenar por fecha (próximos primero)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    try {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      
      if (!isValid(dateA) || !isValid(dateB)) {
        return 0; // Si alguna fecha no es válida, no cambiamos el orden
      }
      
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      console.error('Error sorting dates:', error);
      return 0;
    }
  });

  // Verificar si una cita ya ha pasado
  const isCitaPasada = (fecha: Date | string, hora: string): boolean => {
    try {
      let date = typeof fecha === 'string' ? new Date(fecha) : fecha;
      
      // Si la fecha es hoy, verificar si la hora ya pasó
      if (isToday(date)) {
        const [hoursStr, minutesStr] = hora.split(':');
        const appointmentHours = parseInt(hoursStr);
        const appointmentMinutes = parseInt(minutesStr);
        
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        
        // Si la hora actual es mayor que la hora de la cita, la cita ya pasó
        if (currentHours > appointmentHours || 
            (currentHours === appointmentHours && currentMinutes > appointmentMinutes)) {
          return true;
        }
        return false;
      }
      
      // Si la fecha es anterior a hoy, la cita ya pasó
      return isPast(date) && !isToday(date);
    } catch (error) {
      console.error('Error checking if appointment is past:', error);
      return false;
    }
  };

  const handleOpenFinalizarModal = (appointment: Appointment) => {
    setCurrentCita(appointment);
    setShowFinalizarModal(true);
  };

  const handleCloseFinalizarModal = () => {
    setShowFinalizarModal(false);
    setCurrentCita(null);
  };

  const handleFinalizarSuccess = () => {
    setShowFinalizarModal(false);
    setCurrentCita(null);
    fetchAppointments();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
      </div>
      
      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by pet or reason..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>
      
      {/* Lista de citas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading appointments...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {sortedAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <PawPrint className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{getPetName(appointment.mascota_id)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDateSafe(appointment.fecha, 'MMMM d, yyyy')}</div>
                        <div className="text-sm text-gray-500">{appointment.hora}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appointment.motivo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isCitaPasada(appointment.fecha, appointment.hora) && (
                          <button
                            onClick={() => handleOpenFinalizarModal(appointment)}
                            className="inline-flex items-center px-3 py-1 border border-green-600 text-xs font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Finalizar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-gray-500">
                {searchTerm || dateFilter ? "Try adjusting your filters." : "No appointments have been scheduled yet."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal para finalizar cita */}
      {showFinalizarModal && currentCita && (
        <FinalizarCitaModal 
          cita={currentCita}
          treatments={treatments}
          onClose={handleCloseFinalizarModal}
          onSuccess={handleFinalizarSuccess}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;