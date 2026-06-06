"use client";

import { useEffect, useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types/product";
import styles from "@/styles/Admin.module.css";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports"];

const emptyForm = {
  name: "",
  category: "Electronics",
  price: "",
  stock: "",
  image: "",
  description: "",
};

type Status = { type: "success" | "error"; message: string };

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <h1 className={styles.loginTitle}>Admin Login</h1>
        <p className={styles.loginSubtitle}>Sign in to manage products</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className={styles.input}
              autoComplete="username"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.loginError}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={styles.loginBtn}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className={styles.demoCredentials}>
          <p className={styles.demoTitle}>Demo credentials</p>
          <p className={styles.demoLine}>
            User: <code className={styles.demoCode}>islam</code>
          </p>
          <p className={styles.demoLine}>
            Password: <code className={styles.demoCode}>islam123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading, logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      setStatus({
        type: "error",
        message: "Failed to load products. Check your Firebase configuration.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  function showStatus(type: Status["type"], message: string) {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 3000);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      description: product.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const data = {
      name: form.name.trim(),
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      image: form.image.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, data);
        showStatus("success", "Product updated.");
      } else {
        await createProduct(data);
        showStatus("success", "Product added.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch {
      showStatus("error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {
      showStatus("error", "Failed to delete product. Please try again.");
    }
  }

  if (authLoading) {
    return (
      <main className={styles.main}>
        <div className="spinner" />
      </main>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <main className={styles.main}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage your product catalog</p>
        </div>
        <button onClick={logout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <section className={styles.formSection}>
        <h2 className={styles.sectionTitle}>
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        {status && (
          <p
            className={`${styles.statusMsg} ${
              status.type === "error"
                ? styles.statusError
                : styles.statusSuccess
            }`}
          >
            {status.message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={styles.input}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Price (€)</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="1"
                required
                className={styles.input}
              />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                required
                className={styles.input}
              />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short product description"
                required
                rows={3}
                className={`${styles.input} ${styles.textarea}`}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>
          All Products ({products.length})
        </h2>

        {loading && <div className="spinner" />}

        {!loading && products.length === 0 && (
          <p className={styles.stateMsg}>No products yet. Add one above.</p>
        )}

        {!loading && products.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={
                      editingId === product.id ? styles.rowEditing : ""
                    }
                  >
                    <td>
                      <div className={styles.productCell}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.thumb}
                        />
                        <span className={styles.productName}>
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>€{product.price.toFixed(2)}</td>
                    <td>
                      {product.stock === 0 ? (
                        <span className={styles.outOfStock}>Out of stock</span>
                      ) : (
                        product.stock
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
