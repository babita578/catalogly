# Catalogly

Catalogly is a React 18 product discovery app that renders a large catalog with 10,000 items, image cards, filtering, account-based download access, and library-based virtualization.

## Features

- React 18 app with `createRoot`
- Concurrent UI updates with `useTransition`
- Deferred filtering with `useDeferredValue`
- Lazy-loaded sort panel with `Suspense`
- Virtualized product grid with `react-window`
- Responsive auto-sizing with `react-virtualized`
- Account creation and login flow stored locally for demo purposes
- Click any product image to download it after login
- Responsive UI for desktop and mobile

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy Publicly

This app is ready to publish on Vercel.

1. Push the project to a GitHub repository.
2. Import that repository into Vercel.
3. Framework preset: `Vite`
4. Build command: `npm run build`
5. Output directory: `dist`

The included [vercel.json](/Users/babitasahu/Documents/Playground/vercel.json) keeps the app working correctly as a single-page application after deployment.

## Project Structure

- `src/App.jsx`: page composition and feature wiring
- `src/components/AuthPanel.jsx`: login and account creation UI
- `src/components/ProductCard.jsx`: product card and download interaction
- `src/components/VirtualizedGrid.jsx`: virtualized grid rendering
- `src/hooks/useLocalAuth.js`: local auth/session logic
- `src/hooks/useProductCatalog.js`: product fetch, filter, and sort logic
- `src/styles.css`: full UI styling
