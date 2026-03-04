import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listArtists, listGenres, listSongs } from "../api/music";
import { SearchBar } from "../components/SearchBar";
import { SongCard } from "../components/SongCard";
import type { Artist, Genre, Song } from "../types";

type Tab = "songs" | "artists" | "genres";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("songs");
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [sortBy, setSortBy] = useState<"popularity" | "newest">("popularity");

  useEffect(() => {
    listSongs().then(setSongs);
    listArtists().then(setArtists);
    listGenres().then(setGenres);
  }, []);

  const songResults = useMemo(() => {
    const filtered = songs.filter((song) =>
      `${song.title} ${song.artistName} ${song.genreName}`.toLowerCase().includes(query.toLowerCase())
    );
    if (sortBy === "newest") {
      return filtered.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }
    return filtered.sort((a, b) => b.views - a.views);
  }, [songs, query, sortBy]);

  const artistResults = useMemo(
    () => artists.filter((artist) => artist.name.toLowerCase().includes(query.toLowerCase())),
    [artists, query]
  );
  const genreResults = useMemo(
    () => genres.filter((genre) => genre.name.toLowerCase().includes(query.toLowerCase())),
    [genres, query]
  );

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Search Music</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Autocomplete songs, artists, and genres in one place.</p>
      </div>

      <SearchBar onChange={setQuery} />

      <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">Suggestions</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {songResults.slice(0, 5).map((song) => (
            <button key={song.id} onClick={() => setQuery(song.title)} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800 dark:text-slate-200">
              {song.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setTab("songs")} className={`rounded-md px-3 py-2 text-sm ${tab === "songs" ? "bg-brand-600 text-white" : "bg-slate-200 dark:bg-slate-700 dark:text-white"}`}>
          Songs
        </button>
        <button onClick={() => setTab("artists")} className={`rounded-md px-3 py-2 text-sm ${tab === "artists" ? "bg-brand-600 text-white" : "bg-slate-200 dark:bg-slate-700 dark:text-white"}`}>
          Artists
        </button>
        <button onClick={() => setTab("genres")} className={`rounded-md px-3 py-2 text-sm ${tab === "genres" ? "bg-brand-600 text-white" : "bg-slate-200 dark:bg-slate-700 dark:text-white"}`}>
          Genres
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "popularity" | "newest")}
          className="ml-auto rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
        >
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {tab === "songs" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {songResults.map((song) => (
            <SongCard key={song.id} song={song} queue={songResults} />
          ))}
        </div>
      ) : null}

      {tab === "artists" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artistResults.map((artist) => (
            <Link key={artist.id} to={`/artists/${artist.id}`} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{artist.name}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{artist.totalSongs} songs</p>
            </Link>
          ))}
        </div>
      ) : null}

      {tab === "genres" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genreResults.map((genre) => (
            <Link key={genre.id} to={`/genres/${genre.id}`} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{genre.name}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{genre.songCount} songs</p>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
