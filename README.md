---

## 📘 README – QR Universe (Backend + Frontend + PostgreSQL)

### 1. Tecnologías

* **Frontend:** React + Vite + TailwindCSS
* **Backend:** Node.js + Express
* **DB:** PostgreSQL
* **Auth:** JWT + cookie HttpOnly
* **Estilos UI:** Tailwind, SweetAlert2, Framer Motion

---

## 2. Requisitos previos en Ubuntu

En la VM de Google Cloud (Ubuntu 22.04 o similar):

```bash
# Actualizar
sudo apt update && sudo apt upgrade -y

# Node (recomendado 18 o 20)
sudo apt install -y nodejs npm

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Git
sudo apt install -y git

# Opcional pero recomendado para producción
sudo apt install -y nginx
```

Comprueba versiones:

```bash
node -v
npm -v
psql --version
```

---

## 3. Clonar el proyecto

```bash
cd /var/www
sudo git clone <TU_REPO_GIT> qr-universe
cd qr-universe
```

Supongamos esta estructura:

```text
qr-universe/
  backend/
  frontend/
  README.md
```

---

## 4. Configuración de PostgreSQL

### 4.1. Entrar a `psql` como usuario postgres

```bash
sudo -u postgres psql
```

### 4.2. Crear base de datos y usuario

```sql
-- Base de datos
CREATE DATABASE qr_universe;

-- Usuario para la app
CREATE USER qr_user WITH ENCRYPTED PASSWORD 'tu_password_segura';

-- Permisos para ese usuario sobre la DB
GRANT ALL PRIVILEGES ON DATABASE qr_universe TO qr_user;
```

### 4.3. Conectarse a la base y habilitar extensión UUID

```sql
\c qr_universe;

-- Extensión para uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 4.4. Esquema de tablas (TODO lo que usamos)

### 🧑‍💻 Tabla `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índice para búsquedas rápidas por email
CREATE INDEX idx_users_email ON users (email);
```

> `password_hash` es el hash de bcrypt, no se guarda la contraseña en claro.

---

### 🔳 Tabla `qr_codes`

```sql
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,              -- Nombre del QR (IG, Facebook, etc.)
  content TEXT NOT NULL,                    -- URL / texto / etc.
  color VARCHAR(20) NOT NULL DEFAULT '#000000',
  bg_color VARCHAR(20) NOT NULL DEFAULT '#ffffff',
  type VARCHAR(20) NOT NULL DEFAULT 'URL',  -- 'URL', 'TEXTO', etc.
  project VARCHAR(100),                     -- carpeta / campaña opcional
  is_active BOOLEAN NOT NULL DEFAULT TRUE,  -- por si luego quieres desactivar
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índice para mostrar QRs ordenados del más nuevo al más viejo por usuario
CREATE INDEX idx_qr_codes_user_created
  ON qr_codes (user_id, created_at DESC);
```

> Esta tabla es exactamente la que mostraste en `\d qr_codes` (con `type`, `project`, etc.).

---

### 4.5. Dar permisos sobre tablas al usuario de la app

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO qr_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO qr_user;

-- Para que en el futuro, las tablas nuevas también tengan permisos
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO qr_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO qr_user;

\q   -- salir de psql
```

Con eso la parte de base de datos queda lista. 💾

---

## 5. Configuración del backend

### 5.1. Instalar dependencias

```bash
cd /var/www/qr-universe/backend
npm install
```

### 5.2. Archivo `.env` del backend

Crea `/var/www/qr-universe/backend/.env`:

```env
# Puerto del backend
PORT=4000

# Config DB
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qr_universe
DB_USER=qr_user
DB_PASSWORD=tu_password_segura

# JWT
JWT_SECRET=pon_aqui_una_cadena_larga_y_segura

# CORS: orígenes permitidos (frontend)
CORS_ORIGINS=http://localhost:5173,http://TU_DOMINIO,http://TU_IP:5173

# Entorno
NODE_ENV=production
```

> En producción real con HTTPS, puedes servir frontend + backend bajo el mismo dominio y usar solo `https://tudominio.com` en `CORS_ORIGINS`.

### 5.3. Levantar backend (modo simple)

Para probar:

```bash
npm start
# o
node server.js
```

Verifica:

```bash
curl http://localhost:4000/api/health
```

Debe responder algo como:

```json
{
  "ok": true,
  "message": "Backend listo y funcionando 💜",
  "dbTime": "2025-11-28T..."
}
```

### 5.4. Levantar backend con PM2 (producción recomendado)

```bash
sudo npm install -g pm2

cd /var/www/qr-universe/backend
pm2 start server.js --name qr-universe-api

# Guardar configuración para que arranque con el servidor
pm2 save
pm2 startup systemd
# sigue las instrucciones que te imprima (un comando sudo extra)
```

---

## 6. Configuración del frontend

### 6.1. Instalar dependencias

```bash
cd /var/www/qr-universe/frontend
npm install
```

### 6.2. Configurar URL de la API (producción)

Lo ideal en producción es que tu **API se sirva como `/api` en el mismo dominio** (con Nginx proxy), entonces puedes configurar algo tipo:

`.env.production` en `frontend`:

```env
VITE_API_URL=/api
```

Y en tu `src/api/axiosClient.js` puedes tener algo así (si lo quieres dejar más “pro” para prod):

```js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
```

> Si lo dejas con `window.location.hostname` + `:4000` también funciona, pero tendrás CORS sí o sí y más rollo con cookies. Lo más limpio: **Nginx → /api → backend** y React le pega solo a `/api`.

### 6.3. Build de producción

```bash
cd /var/www/qr-universe/frontend
npm run build
```

Esto genera la carpeta:

```text
frontend/dist/
```

Esa carpeta es la que vamos a servir con Nginx.

---

## 7. Configurar Nginx (frontend + backend)

Archivo de sitio, por ejemplo:

```bash
sudo nano /etc/nginx/sites-available/qr-universe
```

Contenido básico (HTTP; si luego tienes certificado, cambias a 443):

```nginx
server {
    listen 80;
    server_name TU_IP_PUBLICA TU_DOMINIO;

    # Frontend estático (React build)
    root /var/www/qr-universe/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Proxy al backend Node (API)
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar sitio:

```bash
sudo ln -s /etc/nginx/sites-available/qr-universe /etc/nginx/sites-enabled/qr-universe

sudo nginx -t   # comprobar syntax
sudo systemctl restart nginx
```

Ahora deberías poder entrar a:

* `http://TU_IP` → React (QR Universe)
* Las llamadas a `/api/...` → backend en Node (puerto 4000)

---

## 8. Resumen rápido de comandos importantes

### PostgreSQL

```bash
sudo -u postgres psql
```

Dentro de `psql`:

```sql
CREATE DATABASE qr_universe;
CREATE USER qr_user WITH ENCRYPTED PASSWORD 'tu_password_segura';
GRANT ALL PRIVILEGES ON DATABASE qr_universe TO qr_user;

\c qr_universe;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users (email);

-- Tabla qr_codes
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#000000',
  bg_color VARCHAR(20) NOT NULL DEFAULT '#ffffff',
  type VARCHAR(20) NOT NULL DEFAULT 'URL',
  project VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_qr_codes_user_created ON qr_codes (user_id, created_at DESC);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO qr_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO qr_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO qr_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO qr_user;

\q
```

---

