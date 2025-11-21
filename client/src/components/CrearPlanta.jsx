/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREAR_PLANTA = gql`
  mutation CrearPlanta($nombre: String!) {
    crearPlanta(nombre: $nombre) {
      id
      nombre
    }
  }
`;

const OBTENER_PLANTAS = gql`
  query ObtenerPlantasMenu {
    obtenerPlantas { id nombre }
  }
`;

const CrearPlanta = ({ alTerminar }) => {
  const [nombre, setNombre] = useState('');
  
  const [crearPlanta, { loading }] = useMutation(CREAR_PLANTA, {
    onCompleted: () => {
      setNombre('');
      alert('¡Planta creada exitosamente!');
     
      if (alTerminar) alTerminar();
    },
    refetchQueries: [{ query: OBTENER_PLANTAS }] 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    crearPlanta({ variables: { nombre } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🏭 Registrar Nueva Sede</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de la Planta
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: Colombia, Arequipa..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar Sede'}
        </button>
      </form>
    </div>
  );
};

export default CrearPlanta;