import { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import TablaCostos from './components/TablaCostos';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('sistema_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  // ESTADO DE NAVEGACIÓN
  // Por defecto, mostramos la tabla de la planta 1 (Perú)
  const [vista, setVista] = useState({ tipo: 'COSTOS', id: 1 });

  const handleLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('sistema_usuario', JSON.stringify(datosUsuario));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('sistema_usuario');
  };

  // Función para cambiar de pantalla
  const navegar = (tipo, id = null) => {
    setVista({ tipo, id });
  };

  if (!usuario) return <Login onLoginSuccess={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 1. BARRA LATERAL IZQUIERDA */}
      <Sidebar onNavegar={navegar} vistaActual={vista} />

      {/* 2. ÁREA DE CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center z-10">
          <h1 className="text-lg font-semibold text-gray-700">
            {vista.tipo === 'COSTOS' && 'Gestión de Costos Indirectos'}
            {vista.tipo === 'OPERACIONES' && 'Catálogo Global de Operaciones'}
            {vista.tipo === 'CREAR_PLANTA' && 'Registrar Nueva Sede'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hola, {usuario.nombre}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 font-medium hover:text-red-700">
              Salir
            </button>
          </div>
        </header>

        {/* Contenido Cambiante (Switch) */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            
            {/* CASO 1: VER TABLA DE COSTOS */}
            {vista.tipo === 'COSTOS' && (
              <TablaCostos plantaId={vista.id} />
            )}

            {/* CASO 2: GESTIONAR OPERACIONES (Próximamente) */}
            {vista.tipo === 'OPERACIONES' && (
              <div className="p-10 text-center bg-white rounded-lg shadow">
                <h2 className="text-2xl text-gray-400 font-bold mb-2">🚧 En Construcción</h2>
                <p>Aquí irá el formulario para crear nuevas operaciones globales.</p>
              </div>
            )}

            {/* CASO 3: CREAR PLANTA (Próximamente) */}
            {vista.tipo === 'CREAR_PLANTA' && (
              <div className="p-10 text-center bg-white rounded-lg shadow">
                <h2 className="text-2xl text-gray-400 font-bold mb-2">🏭 Nueva Planta</h2>
                <p>Aquí irá el formulario para registrar una nueva sede.</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;