# Victornillo Ferretería - Proyecto Final: Programación Backend III: Testing y Escalabilidad Backend

## Descripción

**Victornillo Ferretería** es una aplicación de ecommerce completa desarrollada como proyecto final para el curso de **Programación Backend III: Testing y Escalabilidad Backend**, en **Coderhouse**. Construida con **Node.js**, **Express**, y **MongoDB**, esta aplicación permite gestionar productos, carritos de compra, usuarios, y tickets de compra, con un enfoque en la interactividad, seguridad, escalabilidad y pruebas automatizadas.

Utiliza **Handlebars** para renderizar vistas dinámicas, **Socket.io** para actualizaciones en tiempo real, **Nodemailer** para enviar correos electrónicos, y **Passport** con **JWT** para autenticación y autorización seguras. Además, se implementa un sistema robusto de logging con **log4js**, y generación de datos simulados en español con **faker-js** para realizar pruebas de rendimiento y consistencia de datos.

Incluye un sistema de **testing automatizado** desarrollado con **Mocha**, **Jest** y **Supertest**, focalizado en endpoints clave como el de usuarios. Estos tests permiten validar funcionalidades críticas de la API asegurando su correcto comportamiento en distintos escenarios.

La aplicación también cuenta con un **Dockerfile** para facilitar su despliegue en entornos de producción o pruebas. La imagen correspondiente se encuentra publicada en **DockerHub**, permitiendo ejecutar el proyecto rápidamente mediante contenedores, sin necesidad de instalaciones manuales.

La aplicación simula una ferretería online donde los usuarios pueden registrarse, explorar productos, agregar ítems a su carrito, realizar compras y recibir confirmaciones por email. Los administradores tienen acceso a funcionalidades avanzadas, como la gestión de productos, usuarios y tickets, además de herramientas para generar y verificar datos de prueba.



---

## Características Principales

### **Backend**
- **Gestión de Productos**:
  - Crear, leer, actualizar y eliminar productos (CRUD).
  - Eliminación de productos por nombre (solo administradores).
  - Paginación y filtrado de productos.
  - Generación de 50 productos simulados en español para pruebas (`/api/mocks/mockingproducts`).
- **Gestión de Carritos**:
  - Creación automática de un carrito al registrar un usuario.
  - Agregar y eliminar productos del carrito.
  - Visualización de los productos en el carrito con precios y cantidades.
  - Eliminación completa del carrito.
  - Persistencia de carritos en MongoDB con IDs simulados para pruebas.
- **Gestión de Usuarios**:
  - Registro de usuarios con nombre, apellido, edad, email, contraseña, y rol (`user` o `admin`).
  - Login con autenticación basada en email y contraseña.
  - Restauración de contraseña.
  - Roles de usuario (`user` y `admin`) para control de acceso.
  - Perfil de usuario con datos personales y carrito asociado.
  - Generación de 50 usuarios simulados con contraseña encriptada (`coder123`), roles variados, y carritos simulados (`/api/mocks/mockingusers`).
- **Autenticación y Autorización**:
  - Uso de **Passport** con estrategias `local` (registro, login, restore-password) y `jwt` (para rutas protegidas).
  - Tokens JWT almacenados en cookies seguras (`httpOnly`, `secure`).
  - Middleware `requireAdmin` para restringir acceso a rutas administrativas.
- **Sistema de Tickets**:
  - Generación de tickets al finalizar una compra.
  - Visualización de tickets para usuarios y administradores.
  - Manejo de productos no procesados (por falta de stock) durante la compra.
- **Mailing con Nodemailer**:
  - Envío de correos de bienvenida al registrar un usuario.
  - Correos personalizados con el logo de Victornillo Ferretería.
- **WebSockets con Socket.io**:
  - Sincronización en tiempo real de productos para administradores (vista `/realtimeproducts`).
  - Actualización instantánea de la lista de productos al agregar o eliminar.
- **Mocking de Datos**:
  - Módulo de mocking con **faker-js** (locale `es`) para generar usuarios y productos en español.
  - Generación de usuarios simulados con contraseña encriptada (`coder123`), roles (`user` o `admin`), y carritos simulados (sin persistencia en MongoDB).
  - Generación de productos simulados con nombres y descripciones en español.
  - Endpoint para generar e insertar datos en MongoDB (`POST /api/mocks/generateData`).
  - Endpoint para eliminar datos simulados (`DELETE /api/mocks/reset`), incluyendo usuarios, productos, y carritos.
- **Logging**:
  - Sistema de logging con **log4js** para registrar eventos en el servidor (peticiones HTTP, errores, etc.).
  - Logs en consola y archivos para depuración y monitoreo.
  - Logging en el cliente con `console.log` y `console.error` para acciones en el navegador.
- **Testing Automatizado**:
  - Pruebas desarrolladas con **Mocha** y **Supertest**.
  - Validación de endpoints críticos como creación de usuarios y login (`/api/users/register`, `/api/users/login`).
  - Tests ejecutables con `npm test`.
- **Contenerización con Docker**:
  - Proyecto preparado con un `Dockerfile` para su despliegue mediante contenedores.
  - Imagen publicada en **DockerHub** para facilitar su ejecución sin instalación manual.
  - Compatible con entornos de desarrollo, prueba o producción.


### **Frontend**
- **Renderizado Dinámico con Handlebars**:
  - Vistas para productos, carritos, perfil de usuario, tickets, login, registro, y restauración de contraseña.
  - Interfaz responsive con **Materialize CSS**.
- **Interactividad en Tiempo Real**:
  - Actualización de productos en tiempo real en la vista de administración.
  - Notificaciones con **Toastify** para acciones como agregar/eliminar productos del carrito, finalizar una compra, o errores.
- **Gestión de Carritos**:
  - Vista detallada del carrito con productos, cantidades, y precios.
  - Botones para agregar, eliminar productos, vaciar el carrito, o finalizar la compra.
- **Sistema de Tickets**:
  "Vista de los tickets generados luego de una compra, con detalles como el código, fecha, monto total y productos adquiridos."
- **Perfil de Usuario**:
  - Muestra los datos del usuario autenticado y su carrito asociado.

---

## Tecnologías Utilizadas

- **Backend**:
  - Node.js
  - Express
  - MongoDB (con Mongoose)
  - Socket.io (para WebSockets)
  - Nodemailer (para envío de correos)
  - Passport (autenticación)
  - JWT (JSON Web Tokens)
  - Joi (validación de datos)
  - log4js (logging)
  - faker-js (generación de datos simulados, locale `es`)
  - bcrypt (hashing de contraseñas)
  - cors (soporte para CORS)
  - Morgan (logging de peticiones HTTP)
  - cookie-parser (manejo de cookies)
  - Mocha (framework de testing)
  - Supertest (pruebas de endpoints HTTP)
- **Frontend**:
  - Handlebars (motor de plantillas)
  - Materialize CSS (framework de diseño)
  - Toastify (notificaciones)
  - Socket.io-client (para comunicación en tiempo real)
- **Otros**:
  - dotenv (gestión de variables de entorno)
  - Docker (contenedorización y despliegue)

---

## Endpoints Principales

### **Productos**
- `GET /api/products`: Lista todos los productos (con paginación).
- `GET /api/products/:productId`: Obtiene un producto por ID.
- `POST /api/products`: Crea un nuevo producto (solo admin).
- `PUT /api/products/:productId`: Actualiza un producto (solo admin).
- `DELETE /api/products/:productId`: Elimina un producto (solo admin).

### **Carritos**
- `GET /api/carts`: Lista todos los carritos (solo admin).
- `GET /api/carts/:cartId`: Obtiene los detalles de un carrito.
- `POST /api/carts`: Crea un nuevo carrito.
- `POST /api/carts/:cartId/products/:productId`: Agrega un producto al carrito.
- `DELETE /api/carts/:cartId/products/:productId`: Elimina un producto del carrito.
- `DELETE /api/carts/:cartId`: Vacía el carrito.
- `POST /api/carts/:cartId/purchase`: Finaliza la compra y genera un ticket.

### **Usuarios y Sesiones**
- `POST /api/sessions/register`: Registra un nuevo usuario y envía un correo de bienvenida.
- `POST /api/sessions/login`: Autentica al usuario y genera un token JWT.
- `GET /api/sessions/current`: Devuelve los datos del usuario autenticado.
- `POST /api/sessions/restore-password`: Restaura la contraseña del usuario.
- `GET /api/sessions/logout`: Cierra la sesión y elimina el token.
- `GET /api/users`: Lista todos los usuarios guardados en MongoDB (solo admin).

### **Tickets**
- `GET /api/tickets`: Lista todos los tickets (solo admin).
- `GET /api/tickets/:ticketId`: Obtiene los detalles de un ticket.

### **Mocks (Datos Simulados)**
- `GET /api/mocks/mockingusers`: Genera 50 usuarios simulados con contraseña encriptada (`coder123`), roles variados, y carritos simulados (solo admin).
- `GET /api/mocks/mockingproducts`: Genera 50 productos simulados en español (solo admin).
- `POST /api/mocks/generateData`: Genera e inserta usuarios y productos en MongoDB según parámetros numéricos (solo admin).
- `DELETE /api/mocks/reset`: Elimina datos simulados de usuarios, productos, y carritos (solo admin).

### **Logger**
- `GET /api/logger`: Endpoint de prueba para verificar el sistema de logging (solo admin).

---

## Vistas Principales (Frontend)

- `/`: Lista de productos disponibles para todos los usuarios.
- `/realtimeproducts`: Vista de administración para gestionar productos en tiempo real (solo admin).
- `/cart/:cartId`: Detalles del carrito del usuario.
- `/tickets/:ticketId`: Detalles de un ticket de compra.
- `/profile`: Perfil del usuario autenticado.
- `/login` y `/register`: Formularios de login y registro.
- `/restore-password`: Formulario para restaurar contraseña.

---

## Requisitos

- Node.js (versión 20.17.0 o superior)
- MongoDB (local o en la nube, como MongoDB Atlas)
- Una cuenta de Gmail para enviar correos con Nodemailer (requiere contraseña de aplicación)

---

## Ejecución con Docker

También podés correr el servidor de forma rápida utilizando la imagen disponible en Docker Hub.

### 📦 Imagen en Docker Hub

🔗 [Ver en Docker Hub](https://hub.docker.com/repository/docker/icanal/server-docker/)

### 🐳 Docker:

1. **Contrucción de la imagen**:

  docker build -t < Tu nombre de usuario >/server-docker:1.0.0 .

2. **Usar la imagen desde DockerHub**

  docker pull < Tu nombre de usuario >/server.docker:1.0.0

---
## Autor

- **Ignacio Canal**
- [GitHub - NaquiNacho](https://github.com/NaquiNacho)
- Proyecto desarrollado en el curso Backend III de [Coderhouse](https://www.coderhouse.com/)
