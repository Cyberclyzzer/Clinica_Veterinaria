import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import useAppointmentStore from '../../store/appointmentStore';
import useAuthStore from '../../store/authStore';
import usePetStore from '../../store/petStore';

interface RequestAppointmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const RequestAppointmentForm = ({ onClose, onSuccess }: RequestAppointmentFormProps) => {
  const { user } = useAuthStore();
  const { createAppointment } = useAppointmentStore();
  const { pets } = usePetStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mascota_id: '',
    fecha: '',
    hora: '',
    motivo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate required fields
      if (!formData.mascota_id || !formData.fecha || !formData.hora || !formData.motivo) {
        throw new Error('All fields are required');
      }

      await createAppointment({
        mascota_id: formData.mascota_id,
        fecha: new Date(formData.fecha),
        hora: formData.hora,
        motivo: formData.motivo,
        veterinario_id: '', // Will be assigned by staff
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Request Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mascota_id" className="block text-sm font-medium text-gray-700">
              Pet *
            </label>
            <select
              id="mascota_id"
              name="mascota_id"
              value={formData.mascota_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
              <option value="">Select a pet</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
              Time *
            </label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
              Reason for Visit *
            </label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              isLoading={loading}
            >
              Request Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAppointmentForm; 