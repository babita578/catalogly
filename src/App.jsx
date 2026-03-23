import React, { Suspense, lazy } from "react";
import AuthPanel from "./components/AuthPanel";
import VirtualizedGrid from "./components/VirtualizedGrid";
import { useProductCatalog } from "./hooks/useProductCatalog";
import { useLocalAuth } from "./hooks/useLocalAuth";
import { PRODUCT_COUNT } from "./utils/products";

const SortPanel = lazy(() => import("./components/SortPanel"));

export default function App() {
  const {
    products,
    loading,
    error,
    query,
    category,
    sortBy,
    isChecked,
    categories,
    filteredProducts,
    isPending,
    updateCategory,
    updateQuery,
    updateSort,
    setSortVisibility,
  } = useProductCatalog();
  const {
    authError,
    currentUser,
    isAuthenticated,
    login,
    logout,
    signup,
    clearAuthError,
  } = useLocalAuth();

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Catalogly</p>
          <h1>Smart product discovery with gated image downloads.</h1>
        </div>

        <div className="hero-stats">
          <div>
            <span>Total Items</span>
            <strong>{products.length.toLocaleString() || PRODUCT_COUNT.toLocaleString()}</strong>
          </div>
          <div>
            <span>Visible Items</span>
            <strong>{filteredProducts.length.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <AuthPanel
        authError={authError}
        clearAuthError={clearAuthError}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        login={login}
        logout={logout}
        signup={signup}
      />

      <section className="toolbar">
        <label className="field">
          <span>Search</span>
          <input
            type="text"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search by product or category"
          />
        </label>

        <label className="field">
          <span>Category</span>
          <select
            value={category}
            onChange={(event) => updateCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(event) => setSortVisibility(event.target.checked)}
            />
            <span>Show sorting controls</span>
          </label>
        </div>

        {isChecked ? (
          <Suspense fallback={<div className="sort-loading">Loading sort controls...</div>}>
            <SortPanel sortBy={sortBy} onChange={updateSort} />
          </Suspense>
        ) : (
          <div className="sort-placeholder">Enable sorting controls from the toggle.</div>
        )}
      </section>

      <section className="status-row">
        <span>
          Showing <strong>{filteredProducts.length.toLocaleString()}</strong> results
        </span>
        <span>
          {loading
            ? "Loading..."
            : error
              ? error
              : isPending
                ? "Updating large list..."
                : isAuthenticated
                  ? "Ready to download"
                  : "Login required for downloads"}
        </span>
      </section>

      {loading ? (
        "Loading the grid..."
      ) : error ? (
        <div className="status-row">{error}</div>
      ) : (
        <VirtualizedGrid items={filteredProducts} canDownload={isAuthenticated} />
      )}
    </main>
  );
}
