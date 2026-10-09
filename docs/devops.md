# Documentación DevOps — Cine Backend

Este documento describe cómo el código de **Cine Backend** (API en Node.js, Express y TypeScript) pasa del repositorio a un servidor en ejecución, y qué controles automáticos se aplican en el camino.

Dos decisiones del equipo se apartan del enunciado original:

- **Sin Proxmox.** El laboratorio corre en contenedores Docker definidos en `docker-compose.yml`. Cada contenedor cumple el papel que el enunciado asignaba a una máquina virtual.
- **Sin NestJS.** La aplicación es Express con TypeScript; el flujo DevOps es el mismo.

## Contenido

1. [Arquitectura](#1-arquitectura)
2. [Infraestructura](#2-infraestructura)
3. [Flujo Git](#3-flujo-git)
4. [Estrategia de ramas](#4-estrategia-de-ramas)
5. [Convención de commits](#5-convención-de-commits)
6. [Git Hooks](#6-git-hooks)
7. [SonarQube](#7-sonarqube)
8. [Quality Gate](#8-quality-gate)
9. [Jenkins](#9-jenkins)
10. [Pipeline](#10-pipeline)
11. [Deployment](#11-deployment)
12. [Variables de entorno](#12-variables-de-entorno)
13. [Seguridad](#13-seguridad)
14. [Evidencias del despliegue](#14-evidencias-del-despliegue)
15. [Pendientes conocidos](#15-pendientes-conocidos)

---

## 1. Arquitectura

```
        Developer
            │  git push
            ▼
   GitHub (DEM2/Cine-Backend)
            │  pollSCM cada 5 min
            ▼
┌──────────────────── Docker (docker-compose) ────────────────────┐
│                                                                 │
│   ┌───────────┐   análisis    ┌─────────────┐                   │
│   │  jenkins  │ ────────────▶ │  sonarqube  │                   │
│   │   CI/CD   │ ◀──────────── │   calidad   │                   │
│   └─────┬─────┘    webhook    └─────────────┘                   │
│         │  SSH + rsync                                          │
│         ▼                                                       │
│   ┌───────────┐               ┌─────────────┐                   │
│   │    app    │ ────────────▶ │     db      │                   │
│   │ Node+PM2  │               │ PostgreSQL  │                   │
│   └───────────┘               └─────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

Cada componente tiene una sola responsabilidad:

| Componente | Responsabilidad |
|---|---|
| GitHub | Control de versiones, ramas y Pull Requests |
| Jenkins | Ejecutar el pipeline: validar, analizar, construir y desplegar |
| SonarQube | Análisis estático y decisión del Quality Gate |
| App Server | Ejecutar la API; no se desarrolla ni se compila en él |
| Base de datos | PostgreSQL para la API |

## 2. Infraestructura

### Contenedores

| Servicio | Contenedor | Imagen | Puerto en el host | Límite de memoria |
|---|---|---|---|---|
| `jenkins` | `jenkins` | `jenkins/jenkins:lts-jdk21` + Node.js 22, rsync y cliente SSH | 8080, 50000 | 2560 MB |
| `sonarqube` | `sonarqube` | `sonarqube:26.9.0.129388-community` | 9000 | sin límite |
| `app` | valor de `APP_CONTAINER_NAME` | `node:20-alpine` + sshd y PM2 (target `production`) | 3000 | 512 MB |
| `db` | valor de `DB_CONTAINER_NAME` | `postgres:15-alpine` | 5432 | 512 MB |

Jenkins instala los plugins `git`, `workflow-aggregator`, `ssh-agent` y `sonar` desde su Dockerfile (`jenkins/Dockerfile`).

### Redes

| Red | Servicios | Para qué |
|---|---|---|
| `backend` | `app`, `db` | La API habla con la base de datos |
| `jenkins-network` | `jenkins`, `sonarqube`, `app` | Jenkins analiza en SonarQube y despliega en la app |

La base de datos no está en `jenkins-network`: Jenkins y SonarQube no pueden alcanzarla.

### Volúmenes

`jenkins_home`, `sonarqube_data`, `db_data`, `app_data` (código desplegado) y `app_ssh_host_keys` (llaves de host del servidor SSH). La configuración de Jenkins y SonarQube sobrevive a recrear los contenedores.

### Accesos

| Servicio | URL desde el host | URL entre contenedores | Usuario |
|---|---|---|---|
| Jenkins | http://localhost:8080 | `http://jenkins:8080` | `admin` |
| SonarQube | http://localhost:9000 | `http://sonarqube:9000` | `admin` |
| API | http://localhost:3000 | `app:3000` | — |
| Swagger | http://localhost:3000/api/docs | — | — |
| SSH de despliegue | no expuesto al host | `deploy@app:22` | `deploy`, solo con llave |

Las contraseñas no se documentan aquí. La inicial de Jenkins está en `/var/jenkins_home/secrets/initialAdminPassword` dentro del contenedor.

### Requisitos del equipo anfitrión

Docker necesita **al menos 4 GB de memoria**. Con 3 GB, el análisis de TypeScript de SonarQube no logra arrancar y el pipeline falla con `Failed to start the bridge server (300s timeout)`. En Windows con WSL2 se ajusta en `%USERPROFILE%\.wslconfig`:

```ini
[wsl2]
memory=4GB
swap=4GB
```

### Puesta en marcha

Cada instalación configura su `.env` antes de levantar los contenedores:

```bash
cp .env.example .env
```

| Variable | Qué poner |
|---|---|
| `POSTGRES_PASSWORD` | Contraseña de la base de datos |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Dos secretos aleatorios distintos; el comando para generarlos está en la plantilla |
| `APP_BUILD_TARGET` | `production`: solo ese target incluye el servidor SSH y PM2 que necesita el despliegue |
| `SSH_PUBLIC_KEY` | Llave pública del par que usará Jenkins. Con el target `production` el contenedor no arranca si está vacía |
| `GIT_REPOSITORY`, `GIT_BRANCH` | Repositorio y rama que construirá Jenkins |

El par de llaves se genera una vez por instalación, por ejemplo con `ssh-keygen -t ed25519 -C jenkins-deploy`. La pública va en `.env`; la privada se carga en Jenkins (sección 9) y no se guarda en el repositorio.

Con el `.env` completo:

```bash
docker compose up -d --build
```

El mismo comando sirve en Ubuntu y en Windows. Los nombres de servicio (`db`, `app`, `sonarqube`, `jenkins`) se resuelven dentro de las redes de Docker, y `.gitattributes` mantiene en LF los scripts que se ejecutan dentro de los contenedores. La configuración manual de Jenkins y SonarQube está en las secciones 7 y 9.

## 3. Flujo Git

1. Crear una rama desde `develop` con el número de la historia: `git switch -c feature/US-123`.
2. Programar el cambio y sus pruebas.
3. Hacer commit. Los hooks validan la rama, el mensaje, el lint, las pruebas y la compilación.
4. Hacer push y abrir un Pull Request hacia `develop`.
5. Cuando el cambio está listo para publicarse, abrir un Pull Request de `develop` hacia `main`.
6. Al integrarse en `main`, Jenkins detecta el commit nuevo y ejecuta el pipeline, que termina en el despliegue.

## 4. Estrategia de ramas

| Rama | Uso |
|---|---|
| `main` | Rama desplegable: la que Jenkins construye y despliega. Equivale a la `master` del enunciado |
| `develop` | Integración de las historias antes de publicarlas |
| `feature/US-<número>` | Una rama por historia de usuario |

El hook `pre-commit` solo acepta commits en ramas con el formato exacto `feature/US-<número>`. No se puede hacer commit directo en `main` ni en `develop`: todo entra por Pull Request.

## 5. Convención de commits

Formato:

```text
[US-XXX] tipo: descripción
```

Tipos aceptados: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`, `revert`.

| Ejemplo | Resultado |
|---|---|
| `[US-125] fix: corregir validación de contraseña` | Aceptado |
| `arreglo login` | Rechazado |

Cada commit queda ligado a una historia de usuario, lo que permite rastrear qué cambio pertenece a qué requisito.

## 6. Git Hooks

Los hooks se gestionan con **Husky** y se instalan al ejecutar `npm install` en la raíz del repositorio (script `prepare`).

| Hook | Archivo | Qué valida |
|---|---|---|
| `pre-commit` | `.husky/pre-commit` | Nombre de la rama; luego `npm run lint`, `npm test` y `npm run build` |
| `commit-msg` | `.husky/commit-msg` | Que la primera línea cumpla la convención de commits |

Si cualquier validación falla, el commit se rechaza. En Jenkins los hooks se desactivan con `HUSKY=0`, porque el pipeline ejecuta esas mismas validaciones como etapas.

## 7. SonarQube

SonarQube responde a una pregunta distinta de la del compilador: no si el código funciona, sino qué tan sano está. Mide bugs, vulnerabilidades, code smells, duplicación y cobertura de pruebas.

### Configuración del análisis

El archivo `sonar-project.properties` define:

| Propiedad | Valor |
|---|---|
| Clave del proyecto | `cine-backend` |
| Código fuente | `app/src` |
| Pruebas | archivos `**/__tests__/**/*.test.ts` |
| Cobertura | `app/coverage/lcov.info`, generado por Jest |
| Exclusiones | `node_modules`, `dist`, `coverage`, `*.d.ts` |

### Configuración del servidor (una sola vez)

1. Entrar a http://localhost:9000 y cambiar la contraseña de `admin`.
2. Crear un token de tipo *Global Analysis Token* (Mi cuenta → Seguridad). Se carga en Jenkins, no en el repositorio.
3. Crear el Quality Gate del proyecto (sección 8) y marcarlo como predeterminado.
4. Crear el webhook hacia Jenkins (Administración → Configuración → Webhooks) con la URL `http://jenkins:8080/sonarqube-webhook/`. Sin él, la etapa *Quality Gate* espera 5 minutos y falla.

El proyecto `cine-backend` se crea solo con el primer análisis.

### Análisis local

```bash
SONAR_TOKEN=<token> npm run coverage && npm run sonar
```

## 8. Quality Gate

El Quality Gate decide si el pipeline puede continuar hacia el despliegue. Si no se cumple, Jenkins se detiene y la versión anterior sigue en ejecución.

El gate del proyecto se llama **Cine Backend** y evalúa solo el **código nuevo**:

| Condición | Umbral | Justificación |
|---|---|---|
| Issues nuevos | 0 | Ningún cambio debe introducir bugs, vulnerabilidades ni code smells |
| Cobertura del código nuevo | ≥ 80 % | Todo código nuevo debe llegar con sus pruebas |
| Duplicación del código nuevo | ≤ 3 % | Evita copiar y pegar lógica entre servicios |
| Hotspots de seguridad revisados | 100 % | Ningún punto sensible llega a producción sin revisión |

Se evalúa el código nuevo y no el total porque el proyecto ya existía antes de adoptar SonarQube, con una cobertura global del 27,3 %. Exigir el 80 % sobre todo el código bloquearía cualquier despliegue; exigirlo sobre lo nuevo impide que la deuda crezca y la reduce con cada cambio. SonarQube ignora las condiciones de cobertura y duplicación cuando el cambio tiene menos de 20 líneas nuevas.

El equipo adoptó sin cambios los umbrales que propone SonarQube (*Sonar way*): son el estándar de la herramienta y encajan con la decisión de exigir calidad solo al código nuevo.

### Consulta por API

El estado del gate y las métricas se consultan por la API de SonarQube:

```bash
# Estado del Quality Gate (OK o ERROR)
curl -u <token>: "http://localhost:9000/api/qualitygates/project_status?projectKey=cine-backend"

# Métricas del proyecto
curl -u <token>: "http://localhost:9000/api/measures/component?component=cine-backend&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density"
```

En el pipeline, el paso `waitForQualityGate` obtiene ese mismo estado: SonarQube avisa a Jenkins por el webhook cuando termina de procesar el análisis.

## 9. Jenkins

Jenkins automatiza todo lo que el desarrollador haría a mano: instalar, validar, analizar, construir y desplegar. El pipeline está versionado en el `Jenkinsfile` de la raíz del repositorio.

### Configuración (una sola vez)

| Qué | Dónde | Valor |
|---|---|---|
| Credencial SSH | Administrar Jenkins → Credentials | Tipo *SSH Username with private key*, id `cine-backend-deploy-ssh`, usuario `deploy` |
| Credencial de SonarQube | Administrar Jenkins → Credentials | Tipo *Secret text*, id `sonarqube-token`, con el token de la sección 7 |
| Servidor SonarQube | Administrar Jenkins → System | Nombre `SonarQube`, URL `http://sonarqube:9000`, credencial `sonarqube-token` |
| Scanner | Administrar Jenkins → Tools | Nombre `SonarQubeScanner1`, SonarScanner CLI 7.2.0 |
| Job | Nueva tarea → Pipeline | Nombre `cine-backend`, *Pipeline script from SCM*, repositorio de GitHub, rama `*/main`, script `Jenkinsfile` |

Los nombres `SonarQube`, `SonarQubeScanner1` y `cine-backend-deploy-ssh` deben coincidir exactamente: el `Jenkinsfile` los referencia.

La llave pública que corresponde a la credencial SSH se pone en `SSH_PUBLIC_KEY` del `.env`. El contenedor de la app la instala al arrancar como única llave autorizada del usuario `deploy`.

### Disparo

El pipeline usa `pollSCM('H/5 * * * *')`: Jenkins consulta el repositorio cada 5 minutos y construye si hay commits nuevos en `main`, lleguen por merge de un Pull Request o por push. Los cambios en `develop` y en las ramas `feature/` no disparan el pipeline. El sondeo funciona aunque Jenkins corra en una red local que GitHub no puede alcanzar; un webhook de GitHub exigiría exponer Jenkins a internet.

## 10. Pipeline

| # | Etapa | Qué hace | Falla si |
|---|---|---|---|
| 1 | Checkout | Descarga el código de la rama | El repositorio no responde |
| 2 | Install | `npm ci` en la raíz y en `app/` | Las dependencias no coinciden con el lockfile |
| 3 | Lint | ESLint sobre `app/src` | Hay errores de lint |
| 4 | Test | Pruebas unitarias con Jest | Alguna prueba falla |
| 5 | Coverage | Jest con cobertura; genera `lcov.info` | Alguna prueba falla |
| 6 | SonarQube | Envía código y cobertura a SonarQube | El análisis no termina |
| 7 | Quality Gate | Espera el veredicto de SonarQube (máx. 5 min) | El gate devuelve `ERROR` |
| 8 | Build | Compila TypeScript a `app/dist` | Hay errores de compilación |
| 9 | Desplegar por SSH | Copia la app al servidor y reinicia el proceso | Falla SSH, `npm ci` o PM2 |
| 10 | Health Check | Consulta `/health` en el servidor | No responde 200 en 60 segundos |

Una etapa fallida detiene el pipeline: las siguientes no se ejecutan. Por eso un despliegue nunca ocurre con pruebas rotas ni con el Quality Gate en rojo.

Cada herramienta responde una pregunta distinta:

- **ESLint:** ¿el código cumple nuestras reglas?
- **Jest:** ¿el código funciona según nuestras pruebas?
- **SonarQube:** ¿qué tan sano es el código?
- **Jenkins:** ¿podemos automatizar todo el proceso?

## 11. Deployment

El despliegue lo hace Jenkins por SSH contra el contenedor `app`, con el usuario `deploy`.

1. **Copia.** `rsync` envía el contenido de `app/` (incluido `dist/`, ya compilado por Jenkins) a `/opt/cine-backend`. Se excluyen `node_modules`, `.git`, `coverage` y cualquier archivo `.env`.
2. **Dependencias.** En el servidor se ejecuta `npm ci --omit=dev`: solo dependencias de producción.
3. **Proceso.** PM2 reinicia la aplicación si ya existe, o la crea si es el primer despliegue. Después guarda la lista de procesos (`pm2 save`) para restaurarla al reiniciar el contenedor.
4. **Verificación.** La etapa *Health Check* consulta `GET /health` desde el propio servidor, hasta 30 veces con 2 segundos de espera.

A diferencia del ejemplo del enunciado, el servidor no hace `git pull` ni compila: recibe el artefacto ya construido y validado. Así no necesita acceso al repositorio ni herramientas de desarrollo.

### Health Check

```http
GET /health
```

```json
{ "status": "ok" }
```

Desplegar no garantiza que la aplicación funcione. El health check confirma que el proceso arrancó y atiende peticiones; si no responde, el pipeline termina en fallo.

La aplicación lee su configuración de `/run/cine-backend.env`, un archivo que el contenedor genera al arrancar a partir de sus variables de entorno, con permisos solo para `deploy`.

## 12. Variables de entorno

La configuración vive fuera del código. El archivo `.env` no se versiona; `.env.example` sirve de plantilla y lista todas las variables.

### Aplicación

| Variable | Uso |
|---|---|
| `NODE_ENV` | Entorno de ejecución |
| `APP_PORT` | Puerto de la API |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Conexión a PostgreSQL |
| `POSTGRES_HOST` | Nombre del servicio de la base de datos en el compose (`db`) |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Firma de tokens de sesión |
| `TURNSTILE_SECRET_KEY` | Validación del captcha |
| `CORS_ORIGINS` | Orígenes permitidos, separados por coma |
| `SEAT_LOCK_TTL_MINUTES`, `MAX_TICKETS_PER_SHOWTIME` | Reglas de reserva de asientos |

### Infraestructura

| Variable | Uso |
|---|---|
| `APP_BUILD_TARGET` | `dev` para desarrollo local; `production` para recibir despliegues |
| `APP_DEPLOY_PATH`, `APP_HEALTH_PATH`, `PM2_APP_NAME` | Ruta de despliegue, ruta del health check y nombre del proceso |
| `SSH_HOST`, `SSH_PORT`, `SSH_CREDENTIAL_ID`, `APP_USER` | Destino y credencial del despliegue |
| `SSH_PUBLIC_KEY` | Llave pública de Jenkins autorizada en el servidor |
| `GIT_REPOSITORY`, `GIT_BRANCH` | Repositorio y rama que construye Jenkins |
| `JENKINS_*`, `SONARQUBE_*`, `*_CPU_LIMIT`, `*_MEM_LIMIT` | Puertos, imágenes y límites de recursos |
| `SONAR_NODE_MAXSPACE` | Memoria (MB) del analizador de TypeScript de SonarQube |
| `SONAR_TOKEN` | Token para ejecutar el análisis desde la máquina local |

### Dónde vive cada secreto

| Secreto | Ubicación |
|---|---|
| Llave privada SSH de despliegue | Jenkins Credentials |
| Token de SonarQube para el pipeline | Jenkins Credentials |
| Contraseñas de base de datos y secretos JWT | `.env` local, fuera de Git |

## 13. Seguridad

### Git

- `.gitignore` excluye `.env`, `.env.*`, `*.pem`, `*.key` y `*.crt`. El archivo `.env` nunca se ha versionado.
- El análisis de SonarQube incluye un detector de secretos en el código fuente.

### Jenkins

- El `Jenkinsfile` no contiene contraseñas, tokens ni llaves.
- La llave SSH se inyecta con `sshagent` y el token de SonarQube con `withSonarQubeEnv`; ambos salen de Jenkins Credentials y Jenkins los oculta en los logs.

### Servidor de aplicación

- Usuario de despliegue independiente (`deploy`), sin privilegios de administrador.
- `PermitRootLogin no`: no se puede entrar como `root`.
- `PasswordAuthentication no`: solo se entra con llave.
- `AllowUsers deploy`: ningún otro usuario puede usar SSH.
- El puerto SSH no se publica en el host; solo es alcanzable desde `jenkins-network`.
- La aplicación corre con el usuario `deploy`, no con `root`.

### Aplicación

- Configuración por variables de entorno, sin valores sensibles en el código.
- Autenticación con JWT y contraseñas cifradas con bcrypt.
- CORS restringido a los orígenes de `CORS_ORIGINS`.
- Errores de negocio con `AppError`, que lleva el código HTTP y un mensaje controlado.
- Sin registros de contraseñas, tokens ni cuerpos de petición en los logs. Los logs SQL están desactivados.

## 14. Evidencias del despliegue

Ejecución completa del pipeline el **8 de octubre de 2026**.

| Dato | Valor |
|---|---|
| Job | `cine-backend`, build #2 |
| Rama y commit | `develop`, `2bc8fb1` (*Merge pull request #52 from DEM2/feature/US-449*). El job apuntaba a `develop` porque `main` aún no tenía el `Jenkinsfile` |
| Resultado | `SUCCESS` |
| Duración | 87 segundos |

### Resultado por etapa

| Etapa | Resultado |
|---|---|
| Checkout, Install | Correcto |
| Lint | 0 errores, 79 advertencias |
| Test | 2 suites, 5 pruebas aprobadas |
| Coverage | 38,3 % de sentencias (Jest) |
| SonarQube | `ANALYSIS SUCCESSFUL` |
| Quality Gate | `OK` |
| Build | Correcto |
| Desplegar por SSH | PM2 inició `cine-backend` |
| Health Check | `Health check passed` |

### Extracto del log

```text
22:19:14  Tests:       5 passed, 5 total
22:19:50  INFO  ANALYSIS SUCCESSFUL, you can find the results at: http://sonarqube:9000/dashboard?id=cine-backend
22:19:50  INFO  EXECUTION SUCCESS
22:20:10  [PM2] Starting /usr/local/bin/npm in fork_mode (1 instance)
22:20:11  [PM2] Successfully saved in /home/deploy/.pm2/dump.pm2
22:20:14  Health check passed
Finished: SUCCESS
```

### Verificación externa

```text
$ curl http://localhost:3000/health
{"status":"ok"}                      HTTP 200

$ pm2 ls        (usuario deploy, contenedor de la app)
cine-backend    fork    online
```

### Métricas de SonarQube

| Métrica | Valor |
|---|---|
| Líneas de código | 6.318 |
| Bugs | 0 |
| Vulnerabilidades | 1 |
| Code smells | 21 |
| Duplicación | 0,4 % |
| Cobertura | 27,3 % |
| Quality Gate | `OK` |

Al ser el primer análisis, todo el código cuenta como existente y el gate no evaluó ninguna condición. Las condiciones de la sección 8 aplican desde el siguiente cambio.

### Ejecución fallida previa

El build #1 falló en la etapa *SonarQube* con `Failed to start the bridge server (300s timeout)`, porque Docker tenía 3 GB de memoria. Las etapas *Quality Gate*, *Build*, *Desplegar por SSH* y *Health Check* se omitieron, como debe ocurrir cuando una validación obligatoria falla. Se resolvió subiendo la memoria de WSL2 a 4 GB.

Faltan por adjuntar las capturas de pantalla del build en Jenkins y del dashboard de SonarQube.

## 15. Pendientes conocidos

| Pendiente | Detalle |
|---|---|
| Subir la cobertura | Solo hay 2 archivos de prueba; cualquier funcionalidad nueva sin pruebas fallará el gate |
| Revisar la vulnerabilidad reportada | Visible en el dashboard de SonarQube |
| Revisión de secretos antes del commit | El hook `pre-commit` no escanea secretos; hoy solo lo hace SonarQube en el pipeline |
| Middleware global de errores | Los errores se manejan en cada controlador; no hay un manejador central en `server.ts` |
| Validación de entrada | Zod se usa en un solo middleware; el resto de rutas valida a mano |
| Condición de rama en el despliegue | Hoy solo se despliega `main` porque el job construye esa rama; el `Jenkinsfile` no lo impone por sí mismo |
| Configuración de Jenkins como código | El job, las credenciales y las herramientas se crean a mano |
