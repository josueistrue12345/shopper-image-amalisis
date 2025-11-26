# Image Analyzer - Apartado para Photo Recognition

## Resumen
Proyecto base para análisis de imágenes con IA (Gemini API), FastAPI backend, Celery+Redis para tareas en segundo plano, MongoDB como base de datos y frontend en Next.js + TypeScript. Las imágenes cargadas se guardan localmente en `backend/uploads/`.
F
## Contenido
- frontend/: Next.js + TypeScript
- backend/: FastAPI app, Celery tasks, storage de imagenes
- docker-compose.yml

## Inicio
1. Instala Docker Desktop (con WSL2 habilitado).
2. Clona este repositorio
3. Copia `.env.example` a `.env` y ajusta variables.
   ```
   copy .env.example .env
   ```

## Uso en modo desarrollo (Windows - Docker Desktop)
1. Levanta solo las dependencias:
   ```
   docker-compose -f docker-compose.dev.yml up -d
   ```
2. Instala dependencias del backend:
   ```
   cd backend
   pip install -r requirements.txt
   ```
3. Instala dependencias del frontend:
   ```
   cd frontend
   npm install
   ```
4. Ejecuta los servicios en terminales separadas:
   - Backend: `cd backend && fastapi dev`
   - Frontend: `cd frontend && npm run dev`
   - Celery: `cd backend && celery -A app.core.celery_app worker --pool=solo`
5. Servicios disponibles:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000/docs 


## Para levantar en servidor
1. En consola:
   ```
   docker-compose build
   docker-compose up
   ```
2. Servicios:
   - Frontend: http://localhost:3000
   - Backend (FastAPI): http://localhost:8000/docs
3. Detener:
   ```
   docker-compose down
   ```


## Notas
- Las imágenes subidas se almacenan en `backend/uploads/` dentro del contenedor y en el volumen