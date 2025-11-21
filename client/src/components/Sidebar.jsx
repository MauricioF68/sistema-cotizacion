/* eslint-disable react/prop-types */
import { useQuery, gql } from '@apollo/client';

const OBTENER_PLANTAS = gql`
  query ObtenerPlantasMenu {
    obtenerPlantas {
      id
      nombre
    }
  }
`;
// eslint-disable-next-line react/prop-types
const Sidebar = ({ onNavegar, vistaActual }) => {
  const { data, loading } = useQuery(OBTENER_PLANTAS);

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full shadow-xl">
      {/* Título / Logo */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-blue-400">Cotizador</h2>
        <p className="text-xs text-gray-500 mt-1">v1.0 Sistema de Costos</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        
        {/* SECCIÓN 1: GESTIÓN (Tu propuesta) */}
        <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
          Configuración
        </div>
        
        <button
          onClick={() => onNavegar('OPERACIONES')}
          className={`w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors flex items-center ${vistaActual.tipo === 'OPERACIONES' ? 'bg-gray-800 border-r-4 border-blue-500' : ''}`}
        >
          <span>⚙️ Catálogo Operaciones</span>
        </button>

        <button
          onClick={() => onNavegar('CREAR_PLANTA')}
          className={`w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors flex items-center ${vistaActual.tipo === 'CREAR_PLANTA' ? 'bg-gray-800 border-r-4 border-blue-500' : ''}`}
        >
          <span>🏭 Crear Nueva Planta</span>
        </button>

        <div className="my-4 border-t border-gray-800"></div>

        {/* SECCIÓN 2: COSTOS INDIRECTOS (Lista dinámica) */}
        <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
          Costos por Sede
        </div>

        {loading ? (
          <p className="px-6 text-sm text-gray-600">Cargando sedes...</p>
        ) : (
          data?.obtenerPlantas.map((planta) => (
            <button
              key={planta.id}
              onClick={() => onNavegar('COSTOS', planta.id)}
              className={`w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors flex items-center ${
                vistaActual.tipo === 'COSTOS' && vistaActual.id === planta.id 
                  ? 'bg-gray-800 text-blue-400 font-bold' 
                  : 'text-gray-300'
              }`}
            >
              📄 {planta.nombre}
            </button>
          ))
        )}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-600">
        &copy; 2025 Sistema Cotización
      </div>
    </div>
  );
};

export default Sidebar;