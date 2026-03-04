import { useEffect, useState } from "react";

interface SearchBarProps {
  onChange: (value: string) => void;
}

export function SearchBar({ onChange }: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onChange(value), 350);
    return () => clearTimeout(timer);
  }, [value, onChange]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search by song, artist, or genre..."
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-brand-300 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  );
}
