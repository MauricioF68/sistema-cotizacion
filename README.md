-----

#  Sistema de Cotización 

## 🌟 Introducción al Proyecto

Este es un proyecto **Full-Stack** diseñado para la **gestión y cotización de costos**, ofreciendo una interfaz de usuario limpia y altamente eficiente para la **visualización de datos en tiempo real**.

La arquitectura se fundamenta en el robusto patrón **cliente-servidor**, utilizando **GraphQL** como una capa de comunicación moderna. Esto garantiza peticiones de datos sumamente **eficientes** y **precisas**, optimizando el rendimiento general de la aplicación.

-----

## 🛠️ Stack Tecnológico

El proyecto está organizado en dos entornos distintos: `/client` (Frontend) y `/server` (Backend), cada uno con un conjunto de herramientas especializadas.

| Área | Tecnología | Versión Recomendada | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Frontend** | **React** | v18+ | ⚛️ Construcción de la Interfaz de Usuario. |
| **Frontend** | **Vite** | Última | ⚡ Entorno de desarrollo ultrarrápido y Bundler. |
| **Frontend** | **Apollo Client** | v3.x | 🌐 Consumo eficiente de la API GraphQL. |
| **Styling** | **Tailwind CSS** | v3.x | 🎨 Estilos utilitarios y componentes rápidos. |
| **Backend** | **Node.js** | v18+ | 🟢 Entorno de Ejecución del Servidor. |
| **Backend** | **Apollo Server** | v4.x/v5.x | 🚀 Servidor GraphQL. |
| **Backend** | **Prisma** | v5.x | 📦 ORM para la comunicación con la base de datos. |
| **Comunicación** | **GraphQL** | v16+ | 🔗 Lenguaje de consulta de datos declarativo. |
| **Database** | **Prisma** | **v5.x** | **🛡️ ORM, Migraciones y Cliente de Base de Datos.** |

-----

## ⚙️ Tutorial de Configuración del Entorno

Sigue estos pasos detallados para poner en marcha la aplicación en tu máquina local.

### 1\. Requisitos Previos

Asegúrate de tener instalados estos elementos esenciales antes de continuar:

  * **Node.js (v18 o superior):** Fundamental para ejecutar tanto el servidor como las herramientas de React/Vite.
  * **Gestor de Paquetes (npm):** Incluido automáticamente con la instalación de Node.js.

### 2\. Clonar el Repositorio

Abre tu terminal y ejecuta los siguientes comandos:

```bash
# 📥 Clona el repositorio a tu máquina
git clone https://github.com/MauricioF68/sistema-cotizacion.git

# ➡️ Entra a la carpeta raíz del proyecto
cd sistema_cotizacion
```

-----

### 3\. Configuración del Backend (`/server`)

#### 3.1. Instalación de Dependencias

Navega a la carpeta del servidor e instala los paquetes necesarios:

```bash
cd server
npm install
```

#### 3.2. Configuración de la Base de Datos (Prisma)

**Asegúrate** de que el archivo **`.env`** en la carpeta `/server` contenga la siguiente línea, que apunta a una base de datos local (SQLite):

> ```env
> # .env (en la carpeta /server)
> DATABASE_URL="file:./dev.db"
> ```

Aplica las migraciones de Prisma para inicializar el esquema de la base de datos y crear las tablas:

```bash
# 🧱 Inicializa la base de datos con las tablas
npx prisma migrate dev --name init
```

-----

### 4\. Configuración del Frontend (`/client`)

#### 4.1. Instalación de Dependencias

Regresa a la carpeta raíz del proyecto y luego ingresa a la carpeta del cliente para instalar sus dependencias:

```bash
cd ../client
npm install
```

> **Nota:** El comando `cd ../servidor` y `npm install` parece ser un error de tipeo en el `README` original y ha sido omitido ya que el servidor ya fue configurado en el paso 3.

#### 4.2. Verificación de Conexión Apollo

Confirma que el **cliente Apollo** esté correctamente configurado para conectarse al servidor en el puerto predeterminado (**4000**):

```javascript
// 📍 src/main.jsx
const client = new ApolloClient({
  uri: 'http://localhost:4000', // ✅ Verifica que este puerto sea correcto
  cache: new InMemoryCache(),
});
```

-----

## ▶️ Ejecución de la Aplicación (Desarrollo)

Para iniciar el entorno de desarrollo **Full-Stack**, necesitas abrir **dos terminales** separadas desde la carpeta raíz del proyecto (`sistema_cotizacion`).

### 1\. Iniciar el Servidor (Backend)

En la **primera terminal** (asegúrate de estar en `/server`):

```bash
cd server
node index.js
# 🟢 Debería mostrar: "Server ready at http://localhost:4000/"
```

### 2\. Iniciar el Cliente (Frontend)

En la **segunda terminal** (asegúrate de estar en `/client`):

```bash
cd client
npm run dev
# 🌐 Debería mostrar: "Local: http://localhost:5173/"
```

Abre tu navegador web y navega a **`http://localhost:5173`** para acceder a la aplicación en funcionamiento.

-----

## 📘 Instructivo de Uso

Una vez que ambos entornos estén operativos, la interacción con la aplicación es intuitiva:

### 1\. Acceso y Autenticación (Sistema Inteligente)

| Paso | Descripción | Acción Requerida |
| :--- | :--- | :--- |
| **1.** | **Pantalla de Login** | El sistema te recibirá con el formulario de inicio de sesión. |
| **2.** | **Ingreso de DNI** | 🔑 Ingresa **cualquier número de DNI** o identificación en el campo. |
| **3.** | **Registro/Login** | El sistema verificará el DNI: si **existe**, inicia sesión; si **no existe**, crea automáticamente un nuevo usuario y procede al login. |
| **4.** | **Ingresar** | Haz clic en el botón **"Ingresar al Sistema"**. |

### 2\. Navegación y Dashboard

  * **Dashboard de Costos:** Tras el login exitoso, serás dirigido automáticamente al componente principal (`<TablaCostos />`).
  * **Visualización de Datos:** Podrás observar los datos cargados en tiempo real desde la base de datos, comunicados a través de **GraphQL**.
  * **Cerrar Sesión:** Utiliza el botón **"Salir"** (generalmente en la esquina superior derecha) para finalizar la sesión. Esta acción elimina el DNI del `localStorage` y te redirige a la pantalla de Login.
