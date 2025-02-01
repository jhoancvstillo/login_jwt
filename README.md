# 🛡️ Django & React Authentication (Access & Refresh Tokens)

Este es un proyecto web full-stack que utiliza **Django** para el backend y **React** para el frontend, implementando autenticación basada en **JWT (JSON Web Tokens)**. El **Access Token** se almacena en el `localStorage`, mientras que el **Refresh Token** se guarda en una cookie segura.

## 🚀 Características

- 🔒 **Autenticación con JWT** (Access & Refresh Tokens).
- 🎯 **Backend con Django & Django REST Framework (DRF)**.
- ⚡ **Frontend con React y Context API**.
- 🍪 **Refresh Token almacenado en cookies seguras (HttpOnly)**.
- 🔄 **Auto-refresh de sesión sin necesidad de volver a iniciar sesión**.
- ✅ **Protección de rutas en el frontend**.
- 🛠️ **CORS y configuración segura de cookies**.

---

## 🏰 Tecnologías Usadas

### 🖥️ **Backend (Django)**
- Django
- Django REST Framework (DRF)
- Simple JWT (para la generación de tokens)
- Django CORS Headers

### 🌐 **Frontend (React)**
- React.js (Vite)
- Context API (para manejo de estado global)
- Axios (para peticiones HTTP)
- React Router (para la navegación)

---

## 📦 Instalación

### 🔹 **1. Clonar el repositorio**
```bash
git clone https://github.com/jhoancvstillo/login_jwt.git
cd login_jwt
```

### 🔹 **2. Configurar el Backend (Django)**
```bash
cd backend
python -m venv venv  # Crear entorno virtual
source venv/bin/activate  # Activar entorno (Mac/Linux)
venv\Scripts\activate  # Activar entorno (Windows)

pip install -r requirements.txt  # Instalar dependencias
python manage.py migrate  # Aplicar migraciones
python manage.py createsuperuser  # Crear superusuario (opcional)
python manage.py runserver  # Iniciar servidor
```
El backend correrá en `http://127.0.0.1:8000/`.

### 🔹 **3. Configurar el Frontend (React)**
```bash
cd ../frontend
npm install  # Instalar dependencias
npm run dev  # Iniciar servidor de desarrollo
```
El frontend correrá en `http://localhost:5173/`.

---

## 🔑 Manejo de Tokens

- **Access Token**: Se almacena en `localStorage` y se usa para cada solicitud autenticada.
- **Refresh Token**: Se almacena en una cookie HttpOnly y permite renovar el Access Token cuando expira.

---

## 🔄 Endpoints Principales

### 🔹 **Autenticación**
| Método | Endpoint         | Descripción                     |
|--------|-----------------|---------------------------------|
| POST   | `/api/token/`   | Obtiene el Access y Refresh Token |
| POST   | `/api/token/refresh/` | Renueva el Access Token usando el Refresh Token |
| POST   | `/api/logout/`  | Invalida los tokens |

### 🔹 **Usuarios**
| Método | Endpoint            | Descripción          |
|--------|----------------------|----------------------|
| POST   | `/api/register/`     | Crea un nuevo usuario |
| GET    | `/api/user/`         | Obtiene datos del usuario autenticado |

---

## 🔥 Protección de Rutas en React
El frontend usa `React Router` y `Context API` para proteger rutas privadas:
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
```

Ejemplo de uso:
```jsx
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
```

---

## 🎮 Mejoras Futuras
- 🔹 Implementar `refresh` automático de tokens.
- 🔹 Usar `Redux Toolkit` en lugar de `Context API` para el manejo global del estado.
- 🔹 Añadir roles y permisos avanzados.

---

## 🐝 Licencia
Este proyecto está bajo la **Licencia MIT**.

📌 **Autor:** [Jhoan Castillo](https://github.com/jhoancvstillo)

---

### 🚀 ¡Disfruta programando! 💻

