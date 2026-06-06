"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import styles from "@/styles/ProductCard.module.css";

interface Props {
  product: Product;
}


export default function ProductCard({ product }: Props) {
  const { addToCart, items } = useCart();

  const inCart = items.some((item) => item.id === product.id);
  const isOutOfStock = product.stock === 0;
  

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>€{product.price.toFixed(2)}</span>
          {isOutOfStock ? (
            <span className={styles.outOfStock}>Out of stock</span>
          ) : (
            <span className={styles.inStock}>{product.stock} in stock</span>
          )}
        </div>
        <button
          className={`${styles.addBtn} ${isOutOfStock ? styles.addBtnDisabled : ""} ${inCart ? styles.addBtnInCart : ""}`}
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Out of Stock" : inCart ? "Add Again" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
