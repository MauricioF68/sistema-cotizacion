import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';


const LOGIN_MUTATION = gql`
  mutation Login($dni: String!) {
    login(dni: $dni) {
      id
      nombre
      dni
    }
  }
`;
// eslint-disable-next-line react/prop-types
const Login = ({ onLoginSuccess }) => {
  const [dni, setDni] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      
      console.log("Usuario logueado:", data.login);
      onLoginSuccess(data.login); 
    },
    onError: (error) => {
      setErrorMsg("Error al conectar: " + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dni.trim()) return;
    login({ variables: { dni } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Cotización</h1>
          <p className="text-gray-500 text-sm">Ingresa tu DNI para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI / Identificación
            </label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ej: 12345678"
              autoFocus
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 text-xs text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-xs text-gray-400">
          * Si es tu primera vez, se creará una cuenta automáticamente.
        </p>
      </div>
    </div>
  );
};

export default Login;