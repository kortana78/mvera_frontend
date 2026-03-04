import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listSongs } from "../api/music";
import { SongCard } from "../components/SongCard";
import type { Song } from "../types";

export function GenreSongsPage() {
  const { genreId } = useParams<{ genreId: string }>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [sortBy, setSortBy] = useState<"popular" | "newest">("popular");

  useEffect(() => {
    if (!genreId) return;
    listSongs(undefined, genreId).then(setSongs);
  }, [genreId]);

  const sorted = [...songs].sort((a, b) =>
    sortBy === "popular" ? b.views - a.views : (b.createdAt || "").localeCompare(a.createdAt || "")
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Genre Tracks</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "popular" | "newest")}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="popular">Popularity</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((song) => (
          <SongCard key={song.id} song={song} queue={sorted} />
        ))}
      </div>
    </section>
  );
}
