import styles from "@/styles/Controls.module.css";


interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SortSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.sortSelect}
    >
      <option value="default">Sort: Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
