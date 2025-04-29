import { useEffect, useState } from 'react';
import { PawPrint, Plus } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import usePetStore from '../../store/petStore';
import Button from '../../components/ui/Button';
import AddPetForm from '../../components/pet/AddPetForm';

const OwnerPetsPage = () => {
  const { user } = useAuthStore();
  const { pets, fetchPetsByOwner, loading } = usePetStore();
  const [showAddPetForm, setShowAddPetForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPetsByOwner(user.id);
    }
  }, [user, fetchPetsByOwner]);

  const handleAddPetSuccess = () => {
    if (user) {
      fetchPetsByOwner(user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
        <Button
          icon={<Plus size={16} />}
          onClick={() => setShowAddPetForm(true)}
        >
          Add Pet
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading pets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  {pet.photo ? (
                    <img 
                      src={pet.photo}
                      alt={pet.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <PawPrint className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{pet.nombre}</h3>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Breed:</span> {pet.raza || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Species:</span> {pet.especie}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Age:</span> {new Date().getFullYear() - pet.fecha_nacimiento.getFullYear()} {new Date().getFullYear() - pet.fecha_nacimiento.getFullYear() === 1 ? 'year' : 'years'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow p-12 text-center">
              <PawPrint className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-xl font-medium text-gray-900">No pets yet</h3>
              <p className="mt-1 text-gray-500">Get started by adding your first pet.</p>
              <div className="mt-6">
                <Button
                  icon={<Plus size={16} />}
                  onClick={() => setShowAddPetForm(true)}
                >
                  Add Pet
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {showAddPetForm && (
        <AddPetForm
          onClose={() => setShowAddPetForm(false)}
          onSuccess={handleAddPetSuccess}
        />
      )}
    </div>
  );
};

export default OwnerPetsPage;