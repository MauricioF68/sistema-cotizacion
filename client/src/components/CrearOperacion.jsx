import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREAR_OPERACION = gql`
  mutation CrearOperacion($nombre: String!) {
    crearOperacion(nombre: $nombre) {
      id
      nombre
    }
  }
`;

const CrearOperacion = () => {
  const [nombre, setNombre] = useState('');
  
  const [crearOperacion, { loading }] = useMutation(CREAR_OPERACION, {
    onCompleted: () => {
      setNombre('');
      alert('¡Operación agregada al catálogo global!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    crearOperacion({ variables: { nombre } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-500">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">⚙️ Catálogo de Operaciones</h2>
      <p className="mb-4 text-sm text-gray-600">
        Aquí registras los procesos disponibles (Ej: Corte, Barnizado). 
        Luego podrás asignarlos a cada planta individualmente.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre del Proceso / Operación
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: Troquelado"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
        >
          {loading ? 'Guardando...' : 'Agregar al Catálogo'}
        </button>
      </form>
    </div>
  );
};

export default CrearOperacion;