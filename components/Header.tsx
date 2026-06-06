"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const { totalItems } = useCart();
  

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Mini Shop
        </Link>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            Admin
          </Link>
          <Link href="/cart" className={styles.cartLink}>
            Cart
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
