export const initialCatalogState = {
  products: [],
  loading: true,
  error: "",
  query: "",
  category: "All",
  sortBy: "featured",
  isChecked: false,
};

export function productCatalogReducer(state, action) {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, loading: false, error: "" };
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_SORT":
      return { ...state, sortBy: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_ISCHECKED":
      return { ...state, isChecked: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
