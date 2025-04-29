import { create } from 'zustand';
import { CitaTratamiento } from '../types';

// Datos de ejemplo para cita-tratamientos
const mockCitaTratamientos: CitaTratamiento[] = [];

interface CitaTratamientoStore {
  citaTratamientos: CitaTratamiento[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchCitaTratamientos: () => Promise<void>;
  fetchCitaTratamientosByCita: (citaId: string) => Promise<CitaTratamiento[]>;
  crearCitaTratamiento: (citaTratamientoData: Omit<CitaTratamiento, 'id'>) => Promise<CitaTratamiento>;
}

const useCitaTratamientoStore = create<CitaTratamientoStore>((set, get) => ({
  citaTratamientos: [],
  loading: false,
  error: null,
  
  fetchCitaTratamientos: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      set({ citaTratamientos: mockCitaTratamientos, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar tratamientos de cita',
      });
    }
  },
  
  fetchCitaTratamientosByCita: async (citaId: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      const tratamientosFiltrados = mockCitaTratamientos.filter(
        tratamiento => tratamiento.cita_id === citaId
      );
      
      set({ citaTratamientos: tratamientosFiltrados, loading: false });
      return tratamientosFiltrados;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar tratamientos de cita',
      });
      return [];
    }
  },
  
  crearCitaTratamiento: async (citaTratamientoData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      const nuevoCitaTratamiento: CitaTratamiento = {
        ...citaTratamientoData,
        id: `ct-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };
      
      // Agregar a la lista de mock para persistencia entre fetches
      mockCitaTratamientos.push(nuevoCitaTratamiento);
      
      set(state => ({
        citaTratamientos: [...state.citaTratamientos, nuevoCitaTratamiento],
        loading: false,
      }));
      
      return nuevoCitaTratamiento;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear tratamiento de cita',
      });
      throw error;
    }
  },
}));

export default useCitaTratamientoStore; 