import { useState, useEffect } from 'react';

const TablaCostos = () => {
  const [plantas, setPlantas] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');
  const [costos, setCostos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchGraphQL = async (query, variables = {}) => {
    const response = await fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    return result.data;
  };

  useEffect(() => {
    const initData = async () => {
      const query = `
        query {
          obtenerPlantas { id nombre }
          obtenerRangos { id nombre orden }
          obtenerOperaciones { id nombre }
        }
      `;
      const data = await fetchGraphQL(query);
      setPlantas(data.obtenerPlantas);
      setRangos(data.obtenerRangos);
      setOperaciones(data.obtenerOperaciones);
    };
    initData();
  }, []);

  useEffect(() => {
    if (!sedeSeleccionada) {
      setCostos([]);
      return;
    }

    const cargarCostos = async () => {
      setLoading(true);
      try {
        const query = `
          query($plantaId: Int!) {
            obtenerCostos(plantaId: $plantaId) {
              monto
              operacionId
              rangoId
            }
          }
        `;
        const data = await fetchGraphQL(query, { plantaId: parseInt(sedeSeleccionada) });
        setCostos(data.obtenerCostos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarCostos();
  }, [sedeSeleccionada]);

  const costosPorOp = {};
  costos.forEach(c => {
    if (!costosPorOp[c.operacionId]) costosPorOp[c.operacionId] = [];
    costosPorOp[c.operacionId].push(c);
  });

  const getNombreOp = (id) => operaciones.find(op => parseInt(op.id) === id)?.nombre || '...';

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mt-6">
      
      {/* Encabezado y Selector */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reporte de Costos</h2>
          <p className="text-sm text-gray-500">Consulta de tarifas por sede</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="font-medium text-gray-700">Seleccionar Sede:</label>
          <select
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
          >
            <option value="">-- Seleccione --</option>
            {plantas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Estado Vacío */}
      {!sedeSeleccionada && (
        <div className="text-center py-12 bg-gray-50 rounded border border-dashed">
          <p className="text-gray-400 text-lg">👆 Selecciona una sede arriba para ver sus costos.</p>
        </div>
      )}

      {/* Tabla de Reporte */}
      {sedeSeleccionada && (
        <>
          {loading ? (
            <p className="text-center py-10 text-blue-500">Cargando datos...</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider w-48">
                      Operación
                    </th>
                    {rangos.map(r => (
                      <th key={r.id} className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider border-l border-gray-700">
                        {r.nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {Object.keys(costosPorOp).length === 0 ? (
                    <tr>
                      <td colSpan={rangos.length + 1} className="text-center py-8 text-gray-400 italic">
                        Esta sede no tiene operaciones asignadas aún.
                      </td>
                    </tr>
                  ) : (
                    Object.keys(costosPorOp).map(opIdInt => {
                      const opId = parseInt(opIdInt);
                      const fila = costosPorOp[opId];
                      return (
                        <tr key={opId} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 bg-gray-50 border-r">
                            {getNombreOp(opId)}
                          </td>
                          {rangos.map(r => {
                            const celda = fila.find(c => parseInt(c.rangoId) === parseInt(r.id));
                            const valor = celda ? celda.monto : 0;
                            return (
                              <td key={r.id} className="px-2 py-3 text-right text-gray-600 tabular-nums">
                                {valor > 0 ? (
                                  <span className="font-semibold text-gray-800">
                                    ${valor.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TablaCostos;