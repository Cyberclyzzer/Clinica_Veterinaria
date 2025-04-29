import { create } from 'zustand';
import { Appointment } from '../types';
import { addDays, subDays, setHours, setMinutes, format } from 'date-fns';

// Create mock appointments data
const today = new Date();
const tomorrow = addDays(today, 1);
const yesterday = subDays(today, 1);

// Función para formatear hora
const formatHour = (date: Date): string => {
  return format(date, 'HH:mm');
};

const mockAppointments: Appointment[] = [
  {
    id: '1',
    fecha: today,
    hora: formatHour(setHours(setMinutes(today, 30), 10)),
    mascota_id: '1',
    veterinario_id: '1',
    motivo: 'Annual checkup'
  },
  {
    id: '2',
    fecha: tomorrow,
    hora: formatHour(setHours(setMinutes(tomorrow, 0), 14)),
    mascota_id: '2',
    veterinario_id: '1',
    motivo: 'Vaccination'
  },
  {
    id: '3',
    fecha: yesterday,
    hora: formatHour(setHours(setMinutes(yesterday, 15), 9)),
    mascota_id: '1',
    veterinario_id: '1',
    motivo: 'Skin condition check'
  },
];

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAppointments: () => Promise<void>;
  fetchAppointmentsByOwner: (ownerId: string) => Promise<Appointment[]>;
  createAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (appointment: Appointment) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
}

const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  loading: false,
  error: null,
  
  fetchAppointments: async () => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ appointments: mockAppointments, loading: false });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch appointments', 
      });
    }
  },
  
  fetchAppointmentsByOwner: async (ownerId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Por ahora, simulamos el filtro usando el id de la mascota
      // ya que no tenemos el campo ownerId en el nuevo modelo
      const ownerPets = ['1', '2']; // Mascotas que pertenecen al owner (hardcoded para simular)
      const filteredAppointments = mockAppointments.filter(
        appointment => ownerPets.includes(appointment.mascota_id)
      );
      
      set({ appointments: filteredAppointments, loading: false });
      return filteredAppointments;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch appointments', 
      });
      return [];
    }
  },
  
  createAppointment: async (appointmentData) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a new ID by finding the max ID in the current appointments and adding 1
      const nextId = Math.max(0, ...get().appointments.map(a => parseInt(a.id) || 0)) + 1;
      
      const newAppointment: Appointment = {
        ...appointmentData,
        id: nextId.toString(),
      };
      
      // Add to mockAppointments for persistence between fetches
      mockAppointments.push(newAppointment);
      
      set(state => ({
        appointments: [...state.appointments, newAppointment],
        loading: false,
      }));
      
      return newAppointment;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to create appointment', 
      });
      throw error;
    }
  },
  
  updateAppointment: async (appointment) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update in mockAppointments for persistence
      const index = mockAppointments.findIndex(a => a.id === appointment.id);
      if (index !== -1) {
        mockAppointments[index] = appointment;
      }
      
      set(state => ({
        appointments: state.appointments.map(app => 
          app.id === appointment.id ? appointment : app
        ),
        loading: false,
      }));
      
      return appointment;
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to update appointment', 
      });
      throw error;
    }
  },
  
  deleteAppointment: async (id) => {
    set({ loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from mockAppointments for persistence
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index !== -1) {
        mockAppointments.splice(index, 1);
      }
      
      set(state => ({
        appointments: state.appointments.filter(app => app.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete appointment', 
      });
      throw error;
    }
  }
}));

export default useAppointmentStore;