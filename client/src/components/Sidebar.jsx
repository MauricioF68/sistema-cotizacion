/* eslint-disable react/prop-types */
const Sidebar = ({ onNavegar, vistaActual }) => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full shadow-xl">
      {/* Título / Logo */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-blue-400">Cotizador</h2>
        <p className="text-xs text-gray-500 mt-1">v2.0 Sistema de Costos</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        
        {/* OPCIÓN 1: CONFIGURACIÓN GLOBAL */}
        <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
          Configuración
        </div>
        
        <button
          onClick={() => onNavegar('OPERACIONES')}
          className={`w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors flex items-center ${vistaActual.tipo === 'OPERACIONES' ? 'bg-gray-800 border-r-4 border-blue-500' : ''}`}
        >
          <span>⚙️ Catálogo Operaciones</span>
        </button>

        {/* OPCIÓN 2: CREAR Y ASIGNAR (Donde ocurre la magia) */}
        <button
          onClick={() => onNavegar('GESTION_PLANTAS')}
          className={`w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors flex items-center ${vistaActual.tipo === 'GESTION_PLANTAS' ? 'bg-gray-800 border-r-4 border-blue-500' : ''}`}
        >
          <span>🏭 Gestión de Plantas</span>
        </button>

        <div className="my-4 border-t border-gray-800"></div>

        {/* OPCIÓN 3: REPORTES */}
        <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
          Reportes
        </div>

        <button
          onClick={() => onNavegar('REPORTE_COSTOS')}
          className={`w-full text-left px-6 py-3 hover:bg-gray-800 transition-colors flex items-center ${vistaActual.tipo === 'REPORTE_COSTOS' ? 'bg-gray-800 border-r-4 border-blue-500 font-bold text-blue-400' : ''}`}
        >
          <span>📊 Costos Indirectos</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-600">
        &copy; 2025 Sistema Cotización
      </div>
    </div>
  );
};

export default Sidebar;