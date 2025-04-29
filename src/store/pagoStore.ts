import { create } from 'zustand';
import { Pago, EstadoPago, MetodoPago } from '../types/index';

// Datos de prueba para pagos
const mockPagos: Pago[] = [
  {
    id: '1',
    cita_id: '1',
    monto_total: 150.00,
    fecha_pago: new Date(),
    metodo: MetodoPago.EFECTIVO,
    estado: EstadoPago.COMPLETADO,
  },
  {
    id: '2',
    cita_id: '2',
    monto_total: 85.00,
    fecha_pago: new Date(),
    metodo: MetodoPago.TARJETA,
    estado: EstadoPago.PENDIENTE,
  },
];

interface PagoStore {
  pagos: Pago[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchPagos: () => Promise<void>;
  fetchPagosByCita: (citaId: string) => Promise<Pago[]>;
  fetchPagoById: (id: string) => Promise<Pago | undefined>;
  crearPago: (pago: Omit<Pago, 'id'>) => Promise<Pago>;
  actualizarPago: (pago: Pago) => Promise<Pago>;
  actualizarEstadoPago: (id: string, estado: EstadoPago) => Promise<Pago>;
}

const usePagoStore = create<PagoStore>((set, get) => ({
  pagos: [],
  loading: false,
  error: null,
  
  fetchPagos: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      set({ pagos: mockPagos, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar pagos',
      });
    }
  },
  
  fetchPagosByCita: async (citaId: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      const pagosFiltrados = mockPagos.filter(
        pago => pago.cita_id === citaId
      );
      
      set({ pagos: pagosFiltrados, loading: false });
      return pagosFiltrados;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar pagos',
      });
      return [];
    }
  },
  
  fetchPagoById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      const pago = mockPagos.find(p => p.id === id);
      
      set({ loading: false });
      return pago;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al cargar pago',
      });
      return undefined;
    }
  },
  
  crearPago: async (pagoData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      const nuevoPago: Pago = {
        ...pagoData,
        id: `pago-${Date.now()}`,
      };
      
      // Agregar a pagos simulados para persistencia
      mockPagos.push(nuevoPago);
      
      set(state => ({
        pagos: [...state.pagos, nuevoPago],
        loading: false,
      }));
      
      return nuevoPago;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al crear pago',
      });
      throw error;
    }
  },
  
  actualizarPago: async (pago) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      // Actualizar en pagos simulados para persistencia
      const index = mockPagos.findIndex(p => p.id === pago.id);
      if (index !== -1) {
        mockPagos[index] = pago;
      }
      
      set(state => ({
        pagos: state.pagos.map(p => 
          p.id === pago.id ? pago : p
        ),
        loading: false,
      }));
      
      return pago;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar pago',
      });
      throw error;
    }
  },
  
  actualizarEstadoPago: async (id, estado) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular retraso de red
      
      let pagoActualizado: Pago | undefined;
      
      // Actualizar en el estado
      const pagosActualizados = get().pagos.map(p => {
        if (p.id === id) {
          pagoActualizado = {
            ...p,
            estado,
            // Si el estado es COMPLETADO, actualizar fecha_pago
            fecha_pago: estado === EstadoPago.COMPLETADO ? new Date() : p.fecha_pago
          };
          return pagoActualizado;
        }
        return p;
      });
      
      set({
        pagos: pagosActualizados,
        loading: false,
      });
      
      // Actualizar en pagos simulados para persistencia
      const index = mockPagos.findIndex(p => p.id === id);
      if (index !== -1 && pagoActualizado) {
        mockPagos[index] = pagoActualizado;
      }
      
      if (!pagoActualizado) {
        throw new Error('Pago no encontrado');
      }
      
      return pagoActualizado;
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Error al actualizar estado del pago',
      });
      throw error;
    }
  },
}));

export default usePagoStore; 