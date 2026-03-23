# React 18 Concurrent Product Listing

Small React 18 project that renders a large product catalog with 10,000 items, image cards, sorting, filtering, and manual virtualization.

## Features

- React 18 app with `createRoot`
- Concurrent UI updates with `useTransition`
- Deferred filtering with `useDeferredValue`
- Lazy-loaded sort panel with `Suspense`
- Virtualized product grid for large datasets
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

## Project Structure

- `src/App.jsx`: app logic, dataset generation, filtering, sorting, virtualization
- `src/components/SortPanel.jsx`: sort dropdown
- `src/styles.css`: full UI styling
