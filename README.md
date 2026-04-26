# Dashboard Web de Monitoreo con Grafana (Nivel Pro)

Este proyecto levanta un entorno completo para demostrar **Eficiencia (PUE) y Telemetria** en tiempo real:

- Grafana (dashboard listo para usar)
- Prometheus (recoleccion de metricas)
- Simulador de carga energetica (IT, aire acondicionado y cargas auxiliares)

## Que incluye la demo

1. Grafico de lineas con consumo de **Servidores IT** y **Aire Acondicionado**.
2. Medidor (gauge) grande que calcula automaticamente el **PUE = Energia Total / Energia IT**.
3. Datos que cambian continuamente para ver la aguja del PUE subir o bajar en vivo.
4. Mensaje final integrado en el dashboard, alineado con ISO 22237.

## Requisitos

- Docker
- Docker Compose

## Levantar el entorno

```bash
docker compose up -d --build
```

Abre:

- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090
- Simulador: http://localhost:8000

> El dashboard se provisiona automaticamente al iniciar Grafana.

## Como hacer la demostracion en clase

1. Proyecta Grafana en `Monitoreo PUE - Demo Nivel Pro`.
2. Deja correr 20-30 segundos para que se estabilicen las lineas.
3. Cambia el perfil en segundo plano para mostrar variaciones del PUE:

```bash
./scripts/profile.sh good
./scripts/profile.sh normal
./scripts/profile.sh bad
```

- `good`: mejor eficiencia (PUE mas bajo)
- `bad`: peor eficiencia (PUE mas alto)

## Tu mensaje (texto sugerido)

Asi es como un ingeniero moderno visualiza el cumplimiento de la norma ISO 22237.
No miramos cables todo el dia; miramos dashboards generados por software que nos dicen si la infraestructura fisica esta sana.

## Apagar y limpiar

```bash
docker compose down
```
