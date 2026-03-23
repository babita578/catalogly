import React, {
  Suspense,
  lazy,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

const SortPanel = lazy(() => import("./components/SortPanel"));

const PRODUCT_COUNT = 10000;
const CARD_HEIGHT = 340;
const GAP = 20;
const OVERSCAN_ROWS = 2;

const categories = ["Audio", "Wearables", "Photography", "Home", "Gaming"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function createProducts(count) {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const category = categories[index % categories.length];
    const price = 30 + ((index * 17) % 470);
    const rating = Number((3 + ((index * 13) % 20) / 10).toFixed(1));
    const stock = (index * 7) % 60;

    return {
      id,
      name: `${category} Product ${id}`,
      category,
      price,
      rating,
      stock,
      image: `https://picsum.photos/seed/product-${id}/420/320`,
      accent: `hsl(${(index * 37) % 360} 75% 58%)`,
    };
  });
}

function sortProducts(products, sortBy) {
  const sorted = [...products];

  sorted.sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "stock-desc":
        return b.stock - a.stock;
      default:
        return a.id - b.id;
    }
  });

  return sorted;
}

function getColumnCount(width) {
  if (width >= 1380) return 4;
  if (width >= 1040) return 3;
  if (width >= 700) return 2;
  return 1;
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div
        className="product-image-shell"
        style={{ background: `linear-gradient(135deg, ${product.accent}, #101726)` }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="product-meta">
        <div className="product-topline">
          <span className="pill">{product.category}</span>
          <span className="stock">{product.stock} left</span>
        </div>

        <h3>{product.name}</h3>

        <div className="product-bottomline">
          <strong>{formatCurrency(product.price)}</strong>
          <span>{product.rating} / 5</span>
        </div>
      </div>
    </article>
  );
}

function VirtualizedGrid({ items }) {
  const [viewportHeight, setViewportHeight] = useState(700);
  const [scrollTop, setScrollTop] = useState(0);
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => {
      setViewportHeight(Math.max(window.innerHeight - 280, 480));
      setWidth(window.innerWidth);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const columns = getColumnCount(width);
  const rowHeight = CARD_HEIGHT + GAP;
  const rowCount = Math.ceil(items.length / columns);
  const totalHeight = rowCount * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN_ROWS);
  const visibleRows = Math.ceil(viewportHeight / rowHeight) + OVERSCAN_ROWS * 2;
  const endRow = Math.min(rowCount, startRow + visibleRows);

  const visibleItems = [];
  for (let row = startRow; row < endRow; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const item = items[index];
      if (!item) continue;
      visibleItems.push({ item, row, column });
    }
  }

  return (
    <div
      className="grid-viewport"
      style={{ height: viewportHeight }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div className="grid-canvas" style={{ height: totalHeight }}>
        <div
          className="product-grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {visibleItems.map(({ item, row, column }) => (
            <div
              key={item.id}
              className="grid-item"
              style={{
                top: row * rowHeight,
                left: `calc(${(100 / columns) * column}% + ${(GAP / columns) * column}px)`,
                width: `calc(${100 / columns}% - ${((columns - 1) * GAP) / columns}px)`,
                height: CARD_HEIGHT,
              }}
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [products] = useState(() => createProducts(PRODUCT_COUNT));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isPending, startUiTransition] = useTransition();

  const deferredQuery = useDeferredValue(query);
  const deferredCategory = useDeferredValue(category);

  const filteredProducts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);
      const matchesCategory =
        deferredCategory === "All" || product.category === deferredCategory;

      return matchesQuery && matchesCategory;
    });

    return sortProducts(filtered, sortBy);
  }, [deferredCategory, deferredQuery, products, sortBy]);

  const updateQuery = (value) => {
    startUiTransition(() => {
      setQuery(value);
    });
  };

  const updateCategory = (value) => {
    startUiTransition(() => {
      setCategory(value);
    });
  };

  const updateSort = (value) => {
    startUiTransition(() => {
      setSortBy(value);
    });
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">React 18 concurrent catalog</p>
          <h1>10,000 product images with responsive sorting and filtering.</h1>
          <p className="hero-copy">
            The list is virtualized to keep the DOM light, while React concurrent
            updates keep search and sorting interactions responsive.
          </p>
        </div>

        <div className="hero-stats">
          <div>
            <span>Total Items</span>
            <strong>{PRODUCT_COUNT.toLocaleString()}</strong>
          </div>
          <div>
            <span>Visible Items</span>
            <strong>{filteredProducts.length.toLocaleString()}</strong>
          </div>
          <div>
            <span>Rendering</span>
            <strong>{isPending ? "Deferred" : "Stable"}</strong>
          </div>
        </div>
      </section>

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
            <option value="All">All</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <Suspense fallback={<div className="sort-loading">Loading sort controls...</div>}>
          <SortPanel sortBy={sortBy} onChange={updateSort} />
        </Suspense>
      </section>

      <section className="status-row">
        <span>
          Showing <strong>{filteredProducts.length.toLocaleString()}</strong> results
        </span>
        <span>{isPending ? "Updating large list..." : "Ready"}</span>
      </section>

      <VirtualizedGrid items={filteredProducts} />
    </main>
  );
}
