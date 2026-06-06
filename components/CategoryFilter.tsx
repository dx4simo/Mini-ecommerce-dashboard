import styles from "@/styles/Controls.module.css";

interface Props {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
}


export default function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <div className={styles.categoryButtons}>
      <button
        className={`${styles.categoryBtn} ${selected === "" ? styles.active : ""}`}
        onClick={() => onChange("")}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`${styles.categoryBtn} ${selected === cat ? styles.active : ""}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
