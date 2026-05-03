# ISO/IEC 22237 Data Center Compliance Platform

Demo profesional hecha con **Next.js** para simular monitoreo, riesgos y evidencia operacional alineada con **ISO/IEC 22237** en un data center.

La plataforma funciona como un gemelo digital simplificado: muestra habitaciones criticas, metricas simuladas, cumplimiento por dominio ISO, alertas y escenarios operativos.

## Que incluye

- Dashboard ejecutivo de cumplimiento ISO/IEC 22237.
- Mapa visual del data center por salas.
- Monitoreo simulado de energia, PUE, temperatura, humedad, UPS, HVAC, accesos e incendio.
- Matriz de cumplimiento por dominios ISO/IEC 22237-2 a 22237-8.
- Alertas con severidad, zona afectada, dominio ISO y recomendacion.
- Simulador de escenarios desde la web.
- API interna con Route Handlers de Next.js.
- Docker Compose para levantar la demo con un comando.

## Escenarios disponibles

- Operacion normal.
- Alta eficiencia.
- Falla de climatizacion.
- Sobrecarga UPS.
- Acceso no autorizado.
- Riesgo de incendio.
- PUE alto.
- Recuperacion.

## Ejecutar con Docker

```bash
docker compose up --build
```

Abrir:

```text
http://localhost:3000
```

## Ejecutar en desarrollo

```bash
cd web
npm install
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## API

```text
GET  /api/health
GET  /api/datacenter
POST /api/scenario
```

Ejemplo para cambiar escenario:

```bash
curl -X POST http://localhost:3000/api/scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario":"cooling_failure"}'
```

## Nota importante

Esta demo **no certifica** automaticamente cumplimiento ISO/IEC 22237. Simula una plataforma de monitoreo, evaluacion y evidencia operacional alineada con la norma para fines academicos y demostrativos.
