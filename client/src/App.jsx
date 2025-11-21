import { useState } from 'react';
import Login from './components/Login';
import TablaCostos from './components/TablaCostos';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('sistema_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const handleLogin = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('sistema_usuario', JSON.stringify(datosUsuario));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('sistema_usuario');
  };

  if (!usuario) {
    return <Login onLoginSuccess={handleLogin} />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Simple */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard de Costos</h1>
          <p className="text-xs text-gray-500">Bienvenido, {usuario.nombre || usuario.dni}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Salir
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <TablaCostos />
        </div>
      </main>
    </div>
  );
}

export default App;