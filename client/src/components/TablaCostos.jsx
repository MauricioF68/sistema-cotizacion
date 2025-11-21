import { useQuery, useMutation, gql } from '@apollo/client';

// 1. CONSULTA (Traer datos del servidor)
const OBTENER_DATOS = gql`
  query ObtenerDatosMaestros($plantaId: Int!) {
    obtenerRangos { id nombre orden }
    obtenerOperaciones { id nombre }
    obtenerCostos(plantaId: $plantaId) {
      monto
      operacionId
      rangoId
    }
  }
`;

// 2. MUTACIÓN (Guardar datos al salir de la celda)
const GUARDAR_COSTO = gql`
  mutation GuardarCosto($plantaId: Int!, $operacionId: Int!, $rangoId: Int!, $monto: Float!) {
    guardarCosto(plantaId: $plantaId, operacionId: $operacionId, rangoId: $rangoId, monto: $monto) {
      id
      monto
    }
  }
`;

// eslint-disable-next-line react/prop-types
const TablaCostos = ({ plantaId }) => { 
  const { loading, error, data } = useQuery(OBTENER_DATOS, {
    variables: { plantaId: Number(plantaId)},
    pollInterval: 0, // No recargar automáticamente, solo al guardar
  });

  // Hook para guardar datos
  const [guardarCosto] = useMutation(GUARDAR_COSTO);

  // Función auxiliar para buscar el precio en la lista plana que devuelve la API
  const obtenerMonto = (operacionId, rangoId) => {
    const costo = data.obtenerCostos.find(
      (c) => c.operacionId === Number(operacionId) && c.rangoId === Number(rangoId)
    );
    return costo ? costo.monto : '';
  };

  // Función que se ejecuta al salir del input (onBlur)
  const handleGuardar = (e, operacionId, rangoId) => {
    const valor = parseFloat(e.target.value);
    
    // Solo guardamos si es un número válido
    if (!isNaN(valor)) {
      guardarCosto({
        variables: {
          plantaId: Number(plantaId),
          operacionId: Number(operacionId),
          rangoId: Number(rangoId),
          monto: valor
        },
        refetchQueries: [OBTENER_DATOS] // Recargar datos para asegurar sincronización
      });
    }
  };

  if (loading) return <p className="p-5 text-gray-500">Cargando datos...</p>;
  if (error) return <p className="p-5 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Costos Indirectos - Planta Perú</h2>
        <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
          ⚙️ Configurar Columnas
        </span>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ENCABEZADOS DINÁMICOS (RANGOS) */}
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider">
                Operación
              </th>
              {data.obtenerRangos.map((rango) => (
                <th key={rango.id} className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider border-l border-gray-700">
                  {rango.nombre}
                </th>
              ))}
            </tr>
          </thead>

          {/* CUERPO DINÁMICO (OPERACIONES) */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.obtenerOperaciones.map((op) => (
              <tr key={op.id} className="hover:bg-blue-50 transition-colors">
                {/* Nombre de la Operación */}
                <td className="py-3 px-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                  {op.nombre}
                </td>

                {/* Celdas de Precios (Iteramos los rangos de nuevo para crear las columnas) */}
                {data.obtenerRangos.map((rango) => (
                  <td key={`${op.id}-${rango.id}`} className="p-2 border-l border-gray-100 text-center">
                    <input 
                      type="number" 
                      step="0.01"
                      defaultValue={obtenerMonto(op.id, rango.id)}
                      onBlur={(e) => handleGuardar(e, op.id, rango.id)}
                      className="w-24 p-1 text-center text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400 text-right">
        * Los cambios se guardan automáticamente al salir de la celda.
      </p>
    </div>
  );
};

export default TablaCostos;