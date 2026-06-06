import styles from "@/styles/Controls.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}


export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.searchInput}
    />
  );
}
