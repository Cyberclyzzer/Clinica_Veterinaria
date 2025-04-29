import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import usePagoStore from '../../store/pagoStore';
import usePetStore from '../../store/petStore';
import { EstadoPago } from '../../types/index';
import { Loader2, Download } from 'lucide-react';

const OwnerPagosPage = () => {
  const [activeTab, setActiveTab] = useState<'pendientes' | 'completados' | 'todos'>('pendientes');
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);
  
  const { user } = useAuthStore();
  const { pagos, fetchPagosByCita, loading } = usePagoStore();
  const { pets, fetchPetsByOwner } = usePetStore();

  useEffect(() => {
    if (user) {
      fetchPetsByOwner(user.id);
      // En un caso real, aquí obtendríamos las citas del usuario
      // y luego los pagos asociados a esas citas
    }
  }, [user, fetchPagosByCita, fetchPetsByOwner]);

  // Filtrar pagos según la pestaña activa
  const filteredPagos = pagos.filter(pago => {
    if (activeTab === 'pendientes') {
      return pago.estado === EstadoPago.PENDIENTE;
    } else if (activeTab === 'completados') {
      return pago.estado === EstadoPago.COMPLETADO;
    }
    return true; // 'todos'
  });

  // Ordenar pagos por fecha (los más recientes primero)
  const sortedPagos = [...filteredPagos].sort(
    (a, b) => new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime()
  );

  // Obtener nombre de la mascota (en un caso real, esto sería diferente)
  const getPetName = (citaId: string) => {
    // Simulamos que tenemos una forma de relacionar cita con mascota
    return pets[0]?.nombre || 'Mascota';
  };

  const handleDownload = async (pagoId: string) => {
    setDownloadingIds(prev => [...prev, pagoId]);
    
    try {
      // En un caso real, aquí descargaríamos un comprobante de pago
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular descarga
      alert('Comprobante de pago descargado correctamente!');
    } catch (error) {
      console.error('Error al descargar comprobante:', error);
      alert('Error al descargar el comprobante de pago');
    } finally {
      setDownloadingIds(prev => prev.filter(id => id !== pagoId));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
      
      {/* Tabs */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button 
            onClick={() => setActiveTab('pendientes')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'pendientes'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pendientes
          </button>
          <button 
            onClick={() => setActiveTab('completados')}
            className={`ml-8 py-2 px-4 text-sm font-medium ${
              activeTab === 'completados'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completados
          </button>
          <button 
            onClick={() => setActiveTab('todos')}
            className={`ml-8 py-2 px-4 text-sm font-medium ${
              activeTab === 'todos'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Todos
          </button>
        </nav>
      </div>
      
      {/* Pagos */}
      <div className="mt-6">
        {loading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">Cargando pagos...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
            {sortedPagos.length > 0 ? (
              sortedPagos.map((pago) => (
                <div key={pago.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center
                      ${pago.estado === EstadoPago.COMPLETADO ? 'bg-green-100' : 'bg-yellow-100'}
                    `}>
                      <span className={`text-xl font-medium
                        ${pago.estado === EstadoPago.COMPLETADO ? 'text-green-600' : 'text-yellow-600'}
                      `}>
                        $
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Pago #{pago.id.substring(0, 8)}
                        </h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">{getPetName(pago.cita_id)}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Fecha: {format(new Date(pago.fecha_pago), 'dd/MM/yyyy')}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${pago.monto_total.toFixed(2)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <EstadoBadge estado={pago.estado} />
                          <span className="ml-2 text-sm text-gray-500">
                            Método: {pago.metodo}
                          </span>
                        </div>
                        <button
                          className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded"
                          onClick={() => handleDownload(pago.id)}
                          disabled={downloadingIds.includes(pago.id)}
                        >
                          {downloadingIds.includes(pago.id) ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-1" />
                          )}
                          Comprobante
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron pagos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'pendientes'
                    ? "No tienes pagos pendientes."
                    : activeTab === 'completados'
                    ? "Aún no tienes pagos completados."
                    : "No tienes pagos registrados."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface EstadoBadgeProps {
  estado: EstadoPago;
}

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
  const classes = {
    [EstadoPago.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
    [EstadoPago.COMPLETADO]: 'bg-green-100 text-green-800',
    [EstadoPago.CANCELADO]: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[estado]}`}>
      {estado}
    </span>
  );
};

export default OwnerPagosPage; 