import axios from 'axios';
import { Appointment, CitaTratamiento, EstadoPago, MetodoPago, Pago, Treatment } from '../types';

// URL base de la API del servidor local
const API_URL = 'http://localhost:3001/api';

// Configuración de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios para tratamientos
export const TreatmentService = {
  getAll: async (): Promise<Treatment[]> => {
    try {
      const response = await api.get('/tratamientos/disponibles');
      return response.data.map((item: any) => ({
        id: item.id.toString(),
        descripcion: item.descripcion,
        costo: parseFloat(item.costo)
      }));
    } catch (error) {
      console.error('Error al obtener tratamientos:', error);
      throw error;
    }
  }
};

// Servicios para citas
export const AppointmentService = {
  getAll: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get('/citas/hoy');
      
      return response.data.map((cita: any) => ({
        id: cita.id_cita.toString(),
        fecha: new Date(cita.fecha_hora),
        hora: new Date(cita.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        mascota_id: cita.mascota_id.toString(),
        veterinario_id: cita.veterinario_id.toString(),
        motivo: cita.motivo || ''
      }));
    } catch (error) {
      console.error('Error al obtener citas:', error);
      throw error;
    }
  }
};

// Servicios para CitaTratamiento
export const CitaTratamientoService = {
  createMany: async (citaId: string, treatments: { id: string, cantidad: number }[]): Promise<CitaTratamiento[]> => {
    try {
      const promises = treatments.map(treatment => 
        api.post('/cita-tratamientos', {
          cita_id: citaId,
          tratamiento_id: treatment.id,
          cantidad: treatment.cantidad,
          // El costo se calcula en el backend
        })
      );
      
      const responses = await Promise.all(promises);
      
      return responses.map((res, index) => ({
        id: res.data.id.toString(),
        cita_id: citaId,
        tratamiento_id: treatments[index].id,
        cantidad: treatments[index].cantidad,
        subtotal: parseFloat(res.data.costo_aplicado) * treatments[index].cantidad
      }));
    } catch (error) {
      console.error('Error al crear tratamientos de cita:', error);
      throw error;
    }
  }
};

// Servicios para pagos
export const PagoService = {
  create: async (pagoData: Omit<Pago, 'id'>): Promise<Pago> => {
    try {
      const response = await api.post('/pagos', {
        cita_id: pagoData.cita_id,
        monto_total: pagoData.monto_total,
        fecha_pago: pagoData.fecha_pago.toISOString(),
        metodo_pago: pagoData.metodo,
        estado_pago: pagoData.estado
      });
      
      return {
        id: response.data.id.toString(),
        cita_id: pagoData.cita_id,
        monto_total: pagoData.monto_total,
        fecha_pago: new Date(response.data.fecha_pago),
        metodo: pagoData.metodo,
        estado: pagoData.estado
      };
    } catch (error) {
      console.error('Error al crear pago:', error);
      throw error;
    }
  }
};
