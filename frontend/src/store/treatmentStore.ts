import { create } from 'zustand';
import { Treatment } from '../types';

// Mock treatments data
const mockTreatments: Treatment[] = [
  {
    id: '1',
    descripcion: 'Examen dermatológico completo y pruebas de alergia',
    costo: 85
  },
  {
    id: '2',
    descripcion: 'Medicación antihistamínica para reacción alérgica',
    costo: 35
  }
];

interface TreatmentStore {
  treatments: Treatment[];
  loading: boolean;
  error: string | null;
  fetchTreatments: () => Promise<void>;
}

const useTreatmentStore = create<TreatmentStore>((set) => ({
  treatments: [],
  loading: false,
  error: null,
  fetchTreatments: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar la llamada real a la API
      const mockTreatments: Treatment[] = [
        {
          id: '1',
          descripcion: 'Vacunación completa para perros y gatos',
          costo: 50.00
        },
        {
          id: '2',
          descripcion: 'Tratamiento antiparasitario completo',
          costo: 30.00
        },
        {
          id: '3',
          descripcion: 'Limpieza dental profesional para mascotas',
          costo: 80.00
        },
        {
          id: '4',
          descripcion: 'Consulta veterinaria general',
          costo: 25.00
        }
      ];
      
      set({ treatments: mockTreatments });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch treatments' });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useTreatmentStore;