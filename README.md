Spendy - Frontend
Aplicación web de gestión de gastos personales desarrollada con React + Vite. Permite a los usuarios registrarse, iniciar sesión y administrar sus gastos desde un dashboard centralizado.

🚀 Tecnologías utilizadas
Tecnología            Versión        Descripción
React                 19.2.0       Librería principal de UI
React Router          DOM7.14.2    Manejo de rutas 
SweetAlert2           11.26.24     Alertas y notificaciones
Vite                  7.3.1        Bundler y servidor de desarrollo


📁 Estructura del proyecto
Spendy-Front/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── api.js              # Funciones de peticiones HTTP (login, registro, gastos)
│   ├── assets/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── Header.jsx
│   │   └── Header.css
│   ├── helpers/
│   │   ├── generador.js
│   │   └── local-storage.js
│   ├── IMG/
│   ├── pages/
│   │   ├── Dashboard.jsx       # Panel principal del usuario
│   │   ├── Login.jsx           # Página de inicio de sesión
│   │   ├── Login.css
│   │   └── Register.jsx        # Página de registro
│   ├── router/
│   │   └── router.jsx          # Configuración de rutas
│   ├── services/
│   │   └── api.js              # Endpoints del backend
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js

📌 Rutas de la aplicación
Ruta       Componente       Descripción
/          Login            Página principal — inicio de sesión
/login     Login            Inicio de sesión
/register  Register         Registro de nuevo usuario  
/dashboard Dashboard        Panel principal del usuario

⚙️ Instalación y ejecución
Prerrequisitos

Node.js >= 18
npm >= 9

Pasos
bash# 1. Clonar el repositorio
git clone https://github.com/PaulaCarrion28/Frontend-Spendy.git

# 2. Entrar al proyecto
cd Frontend-Spendy

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev
La aplicación estará disponible en http://localhost:5173

📜 Scripts disponibles
bashnpm run dev       # Inicia el servidor de desarrollo
npm run build     # Genera el build de producción
npm run preview   # Previsualiza el build de producción
npm run lint      # Ejecuta el linter

🌐 Conexión con el Backend
El proyecto consume una API REST. Los endpoints están configurados en src/services/api.js:
Base URL: localhost:8080/
EndpointDescripción/usersGestión de usuarios/merchantsComerciantes/expensesGastos/payment_methodsMétodos de pago/categoryCategorías

Durante el desarrollo se utiliza https://jsonplaceholder.typicode.com como API simulada.


🌿 Flujo de trabajo con Git
Este proyecto usa el siguiente flujo de ramas:
main        → código estable / producción
develop     → integración del equipo
feature/*   → desarrollo de funcionalidades
Para colaboradores (fork)
bash# Configurar el repo original como upstream (solo la primera vez)
git remote add upstream https://github.com/PaulaCarrion28/Frontend-Spendy.git

# Actualizar tu fork con los últimos cambios
git fetch upstream
git checkout develop
git merge upstream/develop
git push origin develop

👥 Equipo
Colaborador                Rama
Paula Carrión Gómez       develop
Sofía Escobar Ascencio    Sofia


📄 Licencia
Este proyecto es de uso privado y académico.
