"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import SortSelect from "@/components/SortSelect";
import { Product } from "@/types/product";
import styles from "@/styles/Home.module.css";


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch(() =>
        setError("Could not load products. Check your Firebase configuration.")
      )
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))];
    return unique.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortOrder === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, selectedCategory, sortOrder]);

  const isFiltered = search.trim() !== "" || selectedCategory !== "";

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Product Catalog</h1>
        <p className={styles.subtitle}>Browse our available products</p>
      </div>

      {loading && <div className="spinner" />}

      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.controls}>
            <SearchBar value={search} onChange={setSearch} />
            <div className={styles.controlsRight}>
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onChange={setSelectedCategory}
              />
              <SortSelect value={sortOrder} onChange={setSortOrder} />
            </div>
          </div>

          {isFiltered && filteredProducts.length > 0 && (
            <p className={styles.resultCount}>
              Showing {filteredProducts.length} of {products.length} product
              {products.length !== 1 ? "s" : ""}
            </p>
          )}

          {filteredProducts.length === 0 && (
            <p className={styles.empty}>
              {isFiltered
                ? "No products match your search."
                : "No products found."}
            </p>
          )}

          {filteredProducts.length > 0 && (
            <div className={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
