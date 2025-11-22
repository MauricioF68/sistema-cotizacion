import { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import TablaCostos from './components/TablaCostos';
import CrearOperacion from './components/CrearOperacion';
import CrearPlanta from './components/CrearPlanta'; 

function App() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('sistema_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  
  const [vista, setVista] = useState({ tipo: 'OPERACIONES', id: null });

  const handleLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('sistema_usuario', JSON.stringify(datosUsuario));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('sistema_usuario');
  };

  const navegar = (tipo, id = null) => {
    setVista({ tipo, id });
  };

  if (!usuario) return <Login onLoginSuccess={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar onNavegar={navegar} vistaActual={vista} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center z-10">
          <h1 className="text-lg font-semibold text-gray-700">
            {vista.tipo === 'OPERACIONES' && 'Catálogo Global de Operaciones'}
            {vista.tipo === 'GESTION_PLANTAS' && 'Gestión de Plantas y Precios'}
            {vista.tipo === 'REPORTE_COSTOS' && 'Reporte de Costos Indirectos'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hola, {usuario.nombre}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 font-medium hover:text-red-700">
              Salir
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            
            {/* 1. CATÁLOGO */}
            {vista.tipo === 'OPERACIONES' && <CrearOperacion />}

            {/* 2. GESTIÓN DE PLANTAS (Aquí pondremos la lógica nueva) */}
            {vista.tipo === 'GESTION_PLANTAS' && (
               <CrearPlanta alTerminar={() => alert("Planta Guardada")} />
            )}

            {/* 3. REPORTE (Aquí pondremos el Selector + Tabla) */}
            {vista.tipo === 'REPORTE_COSTOS' && (
              <TablaCostos />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;