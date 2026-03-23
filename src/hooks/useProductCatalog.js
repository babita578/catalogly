import { useDeferredValue, useEffect, useMemo, useReducer, useTransition } from "react";
import {
  initialCatalogState,
  productCatalogReducer,
} from "../state/productCatalogReducer";
import { expandProducts, sortProducts } from "../utils/products";

export function useProductCatalog() {
  const [state, dispatch] = useReducer(productCatalogReducer, initialCatalogState);
  const [isPending, startUiTransition] = useTransition();

  const { products, query, category, sortBy } = state;
  const deferredQuery = useDeferredValue(query);
  const deferredCategory = useDeferredValue(category);

  useEffect(() => {
    let isActive = true;

    async function fetchProducts() {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const res = await fetch("https://dummyjson.com/products?limit=100");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const expandedProducts = expandProducts(data.products);

        if (isActive) {
          dispatch({ type: "SET_PRODUCTS", payload: expandedProducts });
        }
      } catch (error) {
        console.error("API error", error);
        if (isActive) {
          dispatch({ type: "SET_ERROR", payload: "Failed to load products." });
        }
      }
    }

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((product) => product.category));
    return ["All", ...Array.from(uniqueCategories).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesQuery =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);
      const matchesCategory =
        deferredCategory === "All" ||
        product.category.toLowerCase() === deferredCategory.toLowerCase();

      return matchesQuery && matchesCategory;
    });

    return sortProducts(filtered, sortBy);
  }, [deferredCategory, deferredQuery, products, sortBy]);

  const updateQuery = (value) => {
    startUiTransition(() => {
      dispatch({ type: "SET_QUERY", payload: value });
    });
  };

  const updateCategory = (value) => {
    startUiTransition(() => {
      dispatch({ type: "SET_CATEGORY", payload: value });
    });
  };

  const updateSort = (value) => {
    startUiTransition(() => {
      dispatch({ type: "SET_SORT", payload: value });
    });
  };

  const setSortVisibility = (checked) => {
    dispatch({ type: "SET_ISCHECKED", payload: checked });
  };

  return {
    ...state,
    categories,
    filteredProducts,
    isPending,
    updateCategory,
    updateQuery,
    updateSort,
    setSortVisibility,
  };
}
