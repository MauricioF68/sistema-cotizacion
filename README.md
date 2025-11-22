
````markdown
#  Sistema de Cotización y Gestión de Usuarios 📊

##  Introducción

Este es un proyecto Full-Stack desarrollado para la gestión y cotización de costos, enfocado en proveer una interfaz limpia y eficiente para la visualización de datos en tiempo real de cotizacion.

La arquitectura está basada en el patrón cliente-servidor, utilizando **GraphQL** como capa de comunicación para asegurar peticiones de datos eficientes y precisas.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto se divide en dos entornos (`/client` y `/server`), cada uno con sus propias dependencias.

| Área | Tecnología | Versión Recomendada | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React** | v18+ | Interfaz de Usuario. |
| **Frontend** | **Vite** | Última | Entorno de desarrollo y Bundler. |
| **Frontend** | **Apollo Client** | v3.x | Consumo de la API GraphQL. |
| **Styling** | **Tailwind CSS** | v3.x | Estilos y Componentes Rápidos. |
| **Backend** | **Node.js** | v18+ | Entorno de Ejecución del Servidor. |
| **Backend** | **Apollo Server** | v4.x/v5.x | Servidor GraphQL. |
| **Backend** | **Prisma** | v5.x | ORM para comunicación con la base de datos. |
| **Comunicación** | **GraphQL** | v16+ | Lenguaje de consulta de datos. |
| **Database** | **Prisma** | **v5.x** | **ORM, Migraciones y Cliente de Base de Datos.** |

---

## ⚙️ Tutorial de Configuración del Entorno

Sigue estos pasos detallados para configurar y ejecutar la aplicación en tu máquina local.

### 1. Requisitos Previos

Asegúrate de tener instalado lo siguiente:

* **Node.js (v18 o superior):** Esencial para ejecutar el servidor y las herramientas de React/Vite.
* **Gestor de Paquetes (npm):** Viene incluido con Node.js.

### 2. Clonar el Repositorio

Abre tu terminal y ejecuta los siguientes comandos para descargar el código fuente:

```bash
# Clona el repositorio a tu máquina
git clone https://github.com/MauricioF68/sistema-cotizacion.git

# Entra a la carpeta del proyecto
cd sistema_cotizacion
````

### 3\. Configuración del Backend (`/server`)

#### 3.1. Instalación y Dependencias

```bash
cd server
npm install
```

#### 3.2. Configuración de la Base de Datos (Prisma)

Verifica le existencia del archivo **`.env`** en la carpeta `/server` con la siguiente linea:

```
# .env (en la carpeta /server)
DATABASE_URL="file:./dev.db"
```

Aplica las migraciones de Prisma para crear las tablas en tu base de datos:

```bash
cd server
npx prisma migrate dev --name init
```

### 4\. Configuración del Frontend (`/client`)

#### 4.1. Instalación y Dependencias

```bash
cd ../client
npm install
```
```bash
cd ../servidor
npm install
```
#### 4.2. Verificación de Conexión Apollo

Asegúrate de que el archivo `src/main.jsx` esté apuntando al puerto correcto de tu servidor (por defecto, **4000**):

```javascript
// src/main.jsx
const client = new ApolloClient({
  uri: 'http://localhost:4000', // Asegúrate de que este puerto sea correcto
  cache: new InMemoryCache(),
});
```

-----

## ▶️ Ejecución de la Aplicación (Desarrollo)

Abre **dos terminales** separadas desde la carpeta raíz del proyecto (`sistema_cotizacion`).

### 1\. Iniciar el Servidor (Backend)

En la primera terminal (asegúrate de estar en la carpeta `/server`):

```bash
cd server
node index.js
# Debería mostrar: "Server ready at http://localhost:4000/"
```

### 2\. Iniciar el Cliente (Frontend)

En la segunda terminal (asegúrate de estar en la carpeta `/client`):

```bash
cd client
npm run dev
# Debería mostrar: "Local: http://localhost:5173/"
```

Abre tu navegador y ve a `http://localhost:5173` para acceder a la aplicación.

-----



## 📚 Instructivo de Uso

Una vez que la aplicación esté corriendo en `http://localhost:5173`, la interacción se realiza de la siguiente manera:

### 1\. Acceso y Autenticación

1.  **Pantalla de Login:** El sistema te recibirá con el formulario de inicio de sesión.
2.  **Ingreso de DNI:** Ingresa cualquier número de DNI o identificación en el campo.
3.  **Registro/Login Automático:** El sistema está configurado para:
      * Si el DNI existe, inicia sesión.
      * Si el DNI **no existe**, crea automáticamente un nuevo usuario y procede con el login.
4.  Haz clic en **"Ingresar al Sistema"**.

### 2\. Navegación y Dashboard

1.  **Dashboard:** Tras el login exitoso, serás redirigido al **Dashboard de Costos** (el componente `<TablaCostos />`).
2.  **Visualización:** Aquí podrás ver los datos cargados desde la base de datos a través de GraphQL.
3.  **Cerrar Sesión:** Utiliza el botón **"Salir"** en la esquina superior derecha para cerrar la sesión (esto elimina el DNI del `localStorage` y te devuelve a la pantalla de Login).

<!-- end list -->

```
```
