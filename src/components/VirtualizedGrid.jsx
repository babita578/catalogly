import React from "react";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import { FixedSizeGrid } from "react-window";
import ProductCard from "./ProductCard";
import { CARD_HEIGHT, GAP, getColumnCount, GRID_PADDING } from "../utils/products";

export default function VirtualizedGrid({ items, canDownload }) {
  return (
    <div className="grid-viewport">
      <div className="grid-stage">
        <AutoSizer>
          {({ height, width }) => {
            const columnCount = getColumnCount(width);
            const safeWidth = Math.max(width - GRID_PADDING * 2, 320);
            const columnWidth = Math.floor(
              (safeWidth - GAP * (columnCount - 1)) / columnCount
            );
            const effectiveColumnCount = Math.max(1, columnCount);
            const rowCount = Math.ceil(items.length / effectiveColumnCount);

            const itemData = {
              items,
              columnCount: effectiveColumnCount,
            };

            return (
              <FixedSizeGrid
                className="products-window"
                columnCount={effectiveColumnCount}
                columnWidth={columnWidth + GAP}
                height={height}
                rowCount={rowCount}
                rowHeight={CARD_HEIGHT + GAP}
                width={width}
                itemData={itemData}
                overscanRowCount={3}
              >
                {({ columnIndex, rowIndex, style, data }) => {
                  const index = rowIndex * data.columnCount + columnIndex;
                  const product = data.items[index];

                  if (!product) {
                    return null;
                  }

                  return (
                    <div
                      style={{
                        ...style,
                        left: style.left + GRID_PADDING,
                        top: style.top + GRID_PADDING,
                        width: columnWidth,
                        height: CARD_HEIGHT,
                      }}
                    >
                      <ProductCard product={product} canDownload={canDownload} />
                    </div>
                  );
                }}
              </FixedSizeGrid>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
}
