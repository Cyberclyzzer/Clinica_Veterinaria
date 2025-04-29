import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import usePetStore from '../../store/petStore';
import useAuthStore from '../../store/authStore';

interface AddPetFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddPetForm = ({ onClose, onSuccess }: AddPetFormProps) => {
  const { user } = useAuthStore();
  const { createPet } = usePetStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fecha_nacimiento: '',
    photo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (!formData.nombre || !formData.especie || !formData.raza || !formData.fecha_nacimiento) {
        throw new Error('All fields are required');
      }

      // Create a valid date from the input
      const fecha_nacimiento = new Date(formData.fecha_nacimiento);
      
      // Validate the date
      if (isNaN(fecha_nacimiento.getTime())) {
        throw new Error('Please enter a valid date');
      }

      await createPet({
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        fecha_nacimiento,
        propietario_id: user.id,
        photo: formData.photo || undefined
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Pet</h2>
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
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="especie" className="block text-sm font-medium text-gray-700">
              Species *
            </label>
            <input
              type="text"
              id="especie"
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="raza" className="block text-sm font-medium text-gray-700">
              Breed *
            </label>
            <input
              type="text"
              id="raza"
              name="raza"
              value={formData.raza}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
              Birth Date *
            </label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Photo URL
            </label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
              Add Pet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetForm; 