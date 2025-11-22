import { useState, useEffect } from 'react';

const CrearOperacion = () => {
  const [nombre, setNombre] = useState('');
  const [operaciones, setOperaciones] = useState([]);
  const [error, setError] = useState('');
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

  const cargarOperaciones = async () => {
    try {
      const query = `
        query {
          obtenerOperaciones {
            id
            nombre
          }
        }
      `;
      const data = await fetchGraphQL(query);
      setOperaciones(data.obtenerOperaciones);
    } catch (err) {
      console.error(err);
      setError('Error al cargar el catálogo.');
    }
  };

  useEffect(() => {
    cargarOperaciones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setLoading(true);
    setError('');

    const mutation = `
      mutation($nombre: String!) {
        crearOperacion(nombre: $nombre) {
          id
          nombre
        }
      }
    `;

    try {
      await fetchGraphQL(mutation, { nombre });
      await cargarOperaciones();
      setNombre('');
    } catch (err) {
      setError('Error al crear: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Catálogo Global de Operaciones
      </h2>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Corte, Laminado, Sellado..."
          className="flex-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Guardando...' : 'Agregar'}
        </button>
      </form>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* Lista */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b font-semibold text-gray-600 text-sm uppercase tracking-wide">
          Operaciones Registradas
        </div>
        <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {operaciones.length === 0 ? (
            <li className="p-6 text-gray-400 italic text-center">
              No hay operaciones en el catálogo global.
            </li>
          ) : (
            operaciones.map((op) => (
              <li key={op.id} className="p-4 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></span>
                <span className="text-gray-700 font-medium">{op.nombre}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CrearOperacion;