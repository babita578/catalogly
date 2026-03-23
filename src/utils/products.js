export const PRODUCT_COUNT = 10000;
export const CARD_HEIGHT = 340;
export const GAP = 20;
export const GRID_PADDING = 10;

export function sortProducts(products, sortBy) {
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

export function getColumnCount(width) {
  if (width >= 1380) return 4;
  if (width >= 1040) return 3;
  if (width >= 700) return 2;
  return 1;
}

export function expandProducts(baseProducts) {
  const expandedProducts = [];

  for (let i = 0; i < 100; i += 1) {
    baseProducts.forEach((product, index) => {
      expandedProducts.push({
        ...product,
        id: product.id + i * baseProducts.length,
        name: `${product.title} ${i}`,
        image: product.thumbnail,
        accent: `hsl(${(index * 37 + i * 20) % 360} 75% 58%)`,
      });
    });
  }

  return expandedProducts;
}
