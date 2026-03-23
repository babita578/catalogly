import React, { useTransition } from "react";
import { downloadImage } from "../services/imageDownload";
import { formatCurrency } from "../utils/formatters";

export default function ProductCard({ product, canDownload }) {
  const [isDownloading, startDownloadTransition] = useTransition();

  const handleDownload = () => {
    if (!canDownload) {
      return;
    }

    startDownloadTransition(async () => {
      try {
        const safeName = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await downloadImage(product.image, `${safeName || "product-image"}.webp`);
      } catch (error) {
        console.error("Download failed", error);
      }
    });
  };

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-image-shell"
        onClick={handleDownload}
        aria-label={`Download image for ${product.name}`}
        disabled={!canDownload}
        style={{ background: `linear-gradient(135deg, ${product.accent}, #101726)` }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="product-image"
        />
        <span className="download-chip">
          {!canDownload ? "Login required" : isDownloading ? "Preparing..." : "Download image"}
        </span>
      </button>

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
