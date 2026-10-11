# AdminZoom

Panel educativo con Vue 3.5, Vuetify 4, Pinia 4, Vue Router 5 y Vite 8.
Usa Axios 1 para acceder a la API y SweetAlert2 11 para los diálogos.
La migración elimina Vue CLI, Webpack, Babel, Vuex y vue-axios.

## Requisitos e instalación

Node.js 24 LTS y npm. La versión de Node está declarada en `.nvmrc`.

```sh
nvm use
npm ci
```

## Demo sin backend

```sh
npm run demo
```

Abre http://127.0.0.1:8080 e ingresa cualquier usuario y contraseña no vacíos.
El demo simula login/logout, publicaciones, imágenes, comentarios, respuestas,
horarios y consulta de trámites. Los cambios se reinician al recargar.

La pantalla CV, el registro y los botones de resolución de trámites aún no
tienen implementación funcional. Son partes pendientes del proyecto original.

## Desarrollo con API real

Copia `.env.example` a `.env.local` y configura `VITE_API_BASE_URL`.
Mantén `VITE_MOCK_API=false` para usar la API real.

```sh
npm run dev
```

`npm run serve` es un alias del mismo comando.
Para el demo, `.env.demo` activa `VITE_MOCK_API=true`.
Las sesiones demo y reales usan claves separadas en localStorage.
El cliente HTTP está centralizado en `src/services/api.js`; Pinia gestiona
los datos y la sesión en `src/store/index.js`.

## Compilación y despliegue

```sh
npm run build
npm run preview
```

`npm run build` genera `dist/` con la API real. Para una compilación de
demostración, usa `npm run build:demo`. La vista previa está disponible en
http://127.0.0.1:4173.

El build conserva `web.config` para el enrutamiento de la SPA en IIS.
En otros servidores, configura las rutas de la aplicación para devolver
`index.html` cuando no correspondan a un archivo estático.

Ya no hace falta `--openssl-legacy-provider`.

## Verificación

```sh
npm run lint
npm test
```

ESLint usa configuración plana. Las pruebas de Node verifican la API demo
con Axios actual, incluidos imágenes, publicaciones, comentarios, respuestas
y paginación.

Con Google Chrome instalado y `npm run demo` activo, ejecuta en otra terminal:

```sh
npm run test:e2e
```

La prueba de navegador verifica login, rutas protegidas, imágenes, CRUD,
diálogos, paginación, cursos, trámites, cierre de sesión y navegación móvil.
Guarda capturas en `test-results/`. Para verificar el build demo con
`npm run preview`, usa:

```sh
SMOKE_BASE_URL=http://127.0.0.1:4173 npm run test:e2e
```

`npm run format` aplica Prettier al código de la aplicación.

La API real no está incluida en este repositorio; su integración requiere
un servidor que implemente los endpoints existentes bajo `/api`.

## Referencias de la migración

- [Vue: migración a Vue 3](https://v3-migration.vuejs.org/)
- [Vite](https://vite.dev/guide/)
- [Pinia: migración desde Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)
- [Vuetify: guía de actualización](https://vuetifyjs.com/en/getting-started/upgrade-guide/)
- [Vue Router 5](https://router.vuejs.org/guide/migration/v4-to-v5)
