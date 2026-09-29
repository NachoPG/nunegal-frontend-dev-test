# nunegal-frontend-dev-test

Mini-aplicación (SPA) para comprar dispositivos móviles: listado de productos con búsqueda en tiempo
real y vista de detalle con selección de opciones y alta en la cesta.

> El enunciado pide React/Preact; la empresa confirmó que la prueba podía realizarse con **Angular**.

## Requisitos

- Node.js `^22.22.3`, `^24.15.0` o `>=26` (exigido por Angular CLI 22).
- npm 11.

## Ejecución

```bash
npm install
npm start
```

La aplicación queda disponible en <http://localhost:4200/>.

## Scripts

| Script          | Descripción                                       |
| --------------- | ------------------------------------------------- |
| `npm start`     | Servidor de desarrollo.                           |
| `npm run build` | Compilación de producción en `dist/`.             |
| `npm test`      | Tests unitarios (Vitest).                         |
| `npm run lint`  | Comprobación de código (ESLint + angular-eslint). |

## Stack

Angular 22 (componentes standalone, signals, zoneless), `httpResource` para las lecturas, SCSS propio
sin librería de componentes, Vitest, ESLint y Prettier.

## Notas

- **Contador de la cesta.** La API calcula `count` a partir de una cookie de sesión que el navegador
  no puede enviar desde otro origen (responde con `Access-Control-Allow-Origin: *` y sin credenciales),
  así que desde la aplicación siempre devuelve `1`. Por eso el contador se acumula en `localStorage`
  con el `count` de cada respuesta.
- **Caché.** Las respuestas del listado y del detalle se guardan en `localStorage` durante 1 hora; al
  caducar se vuelven a pedir a la API.
- **Datos de la API.** Se normalizan antes de mostrarse: `displayResolution` y `displaySize` vienen
  intercambiados, hay campos que llegan como texto, como array o vacíos, y algunos productos no tienen
  precio. Un registro defectuoso no rompe el listado: se descarta solo ese registro.
- **Producto inexistente.** La API responde `500` (no `404`); la aplicación muestra «Producto no
  encontrado».
- **Arranque en frío.** La API está en Render y puede tardar cerca de un minuto en responder tras un
  rato inactiva. Si una carga supera los 4 segundos se muestra un aviso, y a los 60 segundos la
  petición se cancela con la opción de reintentar.
