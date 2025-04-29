import { useEffect } from 'react';
import usePagoStore from '../../store/pagoStore';
import { format } from 'date-fns';
import { EstadoPago, MetodoPago } from '../../types';
import { Loader2 } from 'lucide-react';

const PagosPage = () => {
  const { pagos, loading, error, fetchPagos } = usePagoStore();

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pagos</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cita ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagos.length > 0 ? (
                pagos.map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pago.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pago.cita_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${pago.monto_total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(pago.fecha_pago), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <MetodoBadge metodo={pago.metodo} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <EstadoBadge estado={pago.estado} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron pagos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

interface MetodoBadgeProps {
  metodo: MetodoPago;
}

const MetodoBadge: React.FC<MetodoBadgeProps> = ({ metodo }) => {
  const classes = {
    [MetodoPago.EFECTIVO]: 'bg-blue-100 text-blue-800',
    [MetodoPago.TARJETA]: 'bg-purple-100 text-purple-800',
    [MetodoPago.TRANSFERENCIA]: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[metodo]}`}>
      {metodo}
    </span>
  );
};

export default PagosPage; 