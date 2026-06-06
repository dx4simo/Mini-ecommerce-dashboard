"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/Cart.module.css";

export default function CartPage() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();
  

  if (items.length === 0) {
    return (
      <main className={styles.main}>
        <h1 className={styles.title}>Your Cart</h1>
        <div className={styles.emptyState}>
          <p className={styles.empty}>Your cart is empty.</p>
          <Link href="/" className={styles.shopLink}>
            Browse products →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>Your Cart</h1>
        <button onClick={clearCart} className={styles.clearBtn}>
          Clear cart
        </button>
      </div>

      <div className={styles.items}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <img src={item.image} alt={item.name} className={styles.image} />
            <div className={styles.details}>
              <div className={styles.info}>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.category}>{item.category}</p>
                <p className={styles.unitPrice}>€{item.price.toFixed(2)} each</p>
              </div>
              <div className={styles.controls}>
                <div className={styles.qty}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <p className={styles.subtotal}>
                  €{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalPrice}>€{totalPrice.toFixed(2)}</span>
      </div>

      <Link href="/" className={styles.backLink}>
        ← Continue Shopping
      </Link>
    </main>
  );
}
