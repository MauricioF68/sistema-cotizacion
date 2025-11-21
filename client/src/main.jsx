import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000', 
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 3. Envolvemos TODA la app con el Provider */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)