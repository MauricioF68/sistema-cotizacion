/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const CrearPlanta = ({ alTerminar }) => {

  const [paso, setPaso] = useState(1); 
  const [nombrePlanta, setNombrePlanta] = useState('');
  const [plantaId, setPlantaId] = useState(null);

  const [listaOperaciones, setListaOperaciones] = useState([]); 
  const [listaRangos, setListaRangos] = useState([]); 

  const [operacionSeleccionada, setOperacionSeleccionada] = useState('');
  const [costos, setCostos] = useState([]); 
  const [loading, setLoading] = useState(false);

  const fetchGraphQL = async (query, variables = {}) => {
    const response = await fetch('http://localhost:4000/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);
    return result.data;
  };

  useEffect(() => {
    const cargarCatalogos = async () => {
      const query = `
        query {
          obtenerOperaciones { id nombre }
          obtenerRangos { id nombre orden }
        }
      `;
      const data = await fetchGraphQL(query);
      setListaOperaciones(data.obtenerOperaciones);
      setListaRangos(data.obtenerRangos); 
    };
    cargarCatalogos();
  }, []);

  const handleCrearPlanta = async () => {
    if (!nombrePlanta.trim()) return;
    setLoading(true);
    try {
      const mutation = `
        mutation($nombre: String!) {
          crearPlanta(nombre: $nombre) { id nombre }
        }
      `;
      const data = await fetchGraphQL(mutation, { nombre: nombrePlanta });
      setPlantaId(parseInt(data.crearPlanta.id)); 
      setPaso(2); 
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarOperacion = async () => {
    if (!operacionSeleccionada) return;
    setLoading(true);
    try {
      const mutation = `
        mutation($plantaId: Int!, $operacionId: Int!) {
          asignarOperacionAPlanta(plantaId: $plantaId, operacionId: $operacionId)
        }
      `;
      await fetchGraphQL(mutation, { 
        plantaId: plantaId, 
        operacionId: parseInt(operacionSeleccionada) 
      });

      await recargarCostos();
      setOperacionSeleccionada('');
    } catch (error) {
      alert("Error al asignar: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const recargarCostos = async () => {
    const query = `
      query($plantaId: Int!) {
        obtenerCostos(plantaId: $plantaId) {
          id
          monto
          operacionId
          rangoId
        }
      }
    `;
    const data = await fetchGraphQL(query, { plantaId });
    setCostos(data.obtenerCostos);
  };

  const handlePrecioChange = (costoId, nuevoValor) => {
    const valorFloat = parseFloat(nuevoValor) || 0;
    setCostos(prev => prev.map(c => 
      c.id === costoId ? { ...c, monto: valorFloat } : c
    ));
  };

  const handleGuardarTodo = async () => {
    setLoading(true);
    try {

      const promesas = costos.map(c => {
        const mutation = `
          mutation($plantaId: Int!, $operacionId: Int!, $rangoId: Int!, $monto: Float!) {
            guardarCosto(plantaId: $plantaId, operacionId: $operacionId, rangoId: $rangoId, monto: $monto) { id }
          }
        `;
        return fetchGraphQL(mutation, {
          plantaId: plantaId,
          operacionId: c.operacionId,
          rangoId: c.rangoId,
          monto: c.monto
        });
      });

      await Promise.all(promesas);
      alert("¡Planta y precios guardados correctamente!");
      if (alTerminar) alTerminar(); 
    } catch (error) {
      alert("Error al guardar cambios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const costosPorOperacion = {};
  costos.forEach(c => {
    if (!costosPorOperacion[c.operacionId]) {
      costosPorOperacion[c.operacionId] = [];
    }
    costosPorOperacion[c.operacionId].push(c);
  });

  const getNombreOp = (id) => listaOperaciones.find(op => parseInt(op.id) === id)?.nombre || '???';

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mt-6">
      
      {/* PASO 1: Crear Planta */}
      {paso === 1 && (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nueva Planta</h2>
          <p className="text-gray-500 mb-6">Ingresa el nombre de la sede para comenzar la configuración.</p>
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <input 
              type="text" 
              className="border p-3 rounded w-full"
              placeholder="Ej: Planta Chile, Planta Lurin..."
              value={nombrePlanta}
              onChange={e => setNombrePlanta(e.target.value)}
            />
            <button 
              onClick={handleCrearPlanta}
              disabled={loading}
              className="bg-blue-600 text-white px-6 rounded font-bold hover:bg-blue-700"
            >
              {loading ? '...' : 'Crear'}
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: Configuración (Tabla) */}
      {paso === 2 && (
        <div>
          <div className="flex justify-between items-end mb-6 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-blue-600">{nombrePlanta}</h2>
              <p className="text-sm text-gray-400">Configuración de Tarifario</p>
            </div>
            
            {/* Selector para Agregar Operación */}
            <div className="flex gap-2">
              <select 
                className="border p-2 rounded text-sm"
                value={operacionSeleccionada}
                onChange={e => setOperacionSeleccionada(e.target.value)}
              >
                <option value="">-- Seleccionar Operación --</option>
                {listaOperaciones.map(op => (
                  <option key={op.id} value={op.id}>{op.nombre}</option>
                ))}
              </select>
              <button 
                onClick={handleAsignarOperacion}
                disabled={!operacionSeleccionada || loading}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-300"
              >
                + Asignar
              </button>
            </div>
          </div>

          {/* TABLA MATRIX */}
          <div className="overflow-x-auto border rounded-lg mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Operación
                  </th>
                  {listaRangos.map(rango => (
                    <th key={rango.id} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {rango.nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(costosPorOperacion).length === 0 ? (
                  <tr>
                    <td colSpan={listaRangos.length + 1} className="p-8 text-center text-gray-400 italic">
                      Asigna una operación arriba para empezar a llenar precios.
                    </td>
                  </tr>
                ) : (
                  Object.keys(costosPorOperacion).map(opIdInt => {
                    const opId = parseInt(opIdInt);
                    const filaCostos = costosPorOperacion[opId];
                    
                    return (
                      <tr key={opId}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                          {getNombreOp(opId)}
                        </td>
                        {listaRangos.map(rango => {
                            
                          const celda = filaCostos.find(c => parseInt(c.rangoId) === parseInt(rango.id));
                          return (
                            <td key={rango.id} className="px-1 py-2">
                              <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                                  <span className="text-gray-400 sm:text-xs">$</span>
                                </div>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="block w-full rounded-md border-gray-300 pl-5 py-1 text-sm focus:border-blue-500 focus:ring-blue-500 text-right"
                                  placeholder="0.00"
                                  value={celda ? celda.monto : 0}
                                  onChange={(e) => celda && handlePrecioChange(celda.id, e.target.value)}
                                />
                              </div>
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

          <div className="flex justify-end">
            <button
              onClick={handleGuardarTodo}
              className="bg-blue-600 text-white px-8 py-3 rounded shadow-lg hover:bg-blue-700 font-bold transition-transform transform active:scale-95"
            >
              💾 GUARDAR CAMBIOS
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CrearPlanta;