import { useEffect } from 'react';
import useTreatmentStore from '../../store/treatmentStore';
import { Loader2 } from 'lucide-react';

const TreatmentsPage = () => {
  const { treatments, loading, error, fetchTreatments } = useTreatmentStore();

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tratamientos Disponibles</h1>
      <div className="space-y-6">
        {treatments.map((treatment) => (
          <div key={treatment.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{treatment.descripcion}</h2>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">${treatment.costo.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreatmentsPage; 