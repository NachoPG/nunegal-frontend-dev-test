# nunegal-frontend-dev-test

Mini single-page application for buying mobile devices: a product list with real-time search and a
product detail view with option selection and add-to-cart.

## Requirements

- Node.js `^22.22.3`, `^24.15.0` or `>=26` (required by Angular CLI 22).
- npm 11.

## Getting started

```bash
npm install
npm start
```

The application is available at <http://localhost:4200/>.

## Scripts

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `npm start`     | Development server.                     |
| `npm run build` | Production build in `dist/`.            |
| `npm test`      | Unit tests (Vitest).                    |
| `npm run lint`  | Code linting (ESLint + angular-eslint). |

## Stack

Angular 22 (standalone components, signals, zoneless), `httpResource` for data fetching, custom SCSS
without a component library, Vitest, ESLint and Prettier.

## Notes

- **Cart counter.** The API computes `count` from a session cookie that the browser cannot send from
  another origin (it responds with `Access-Control-Allow-Origin: *` and no credentials), so from the
  application it always returns `1`. The counter is therefore accumulated in `localStorage` with the
  `count` of each response.
- **Cache.** Product list and detail responses are stored in `localStorage` for 1 hour; once expired,
  they are requested from the API again.
- **API data.** Data is normalized before being displayed: `displayResolution` and `displaySize` come
  swapped, some fields arrive as a string, as an array or empty, and some products have no price. A
  malformed record does not break the list: only that record is discarded.
- **Unknown product.** The API responds `500` (not `404`); the application shows a "product not
  found" state.
- **Cold start.** The API is hosted on Render and can take about a minute to respond after being idle.
  If loading takes longer than 4 seconds a notice is shown, and after 60 seconds the request is
  cancelled with the option to retry.
