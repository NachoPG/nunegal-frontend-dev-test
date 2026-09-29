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
