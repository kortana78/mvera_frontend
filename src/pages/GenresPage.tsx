import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listGenres } from "../api/music";
import type { Genre } from "../types";

export function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "songs">("songs");

  useEffect(() => {
    listGenres().then(setGenres);
  }, []);

  const sorted = [...genres].sort((a, b) => (sortBy === "songs" ? b.songCount - a.songCount : a.name.localeCompare(b.name)));

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">Explore Genres</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "songs")}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white sm:w-auto"
        >
          <option value="songs">Most Songs</option>
          <option value="name">A-Z</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sorted.map((genre) => (
          <Link
            key={genre.id}
            to={`/genres/${genre.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-2 h-20 rounded-xl bg-gradient-to-br from-orange-300 to-brand-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{genre.name}</h3>
            <p className="mt-2 text-sm text-brand-700">{genre.songCount} songs</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
