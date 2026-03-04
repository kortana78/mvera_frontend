import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listArtists, listGenres, listSongs } from "../api/music";
import { SearchBar } from "../components/SearchBar";
import { SongCard } from "../components/SongCard";
import type { Artist, Genre, Song } from "../types";

export function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSongs = useCallback(async () => {
    setLoading(true);
    const [songsData, artistsData, genresData] = await Promise.all([listSongs(search), listArtists(), listGenres()]);
    setSongs(songsData);
    setArtists(artistsData);
    setGenres(genresData);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const trending = [...songs].sort((a, b) => b.views - a.views).slice(0, 6);
  const newest = [...songs]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 6);
  const featuredArtists = artists.slice(0, 4);
  const featuredGenres = genres.slice(0, 6);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-brand-500 to-amber-400 p-6 text-black shadow-lg sm:p-8">
        <h1 className="text-2xl font-black sm:text-3xl">Stream Malawi and Global Sounds</h1>
        <p className="mt-2 text-sm text-black/80">Discover music, play instantly, and build your own flow.</p>
      </div>
      <SearchBar onChange={setSearch} />
      {loading ? <p className="text-sm text-slate-500">Loading songs...</p> : null}

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trending</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {trending.map((song) => (
            <SongCard key={song.id} song={song} queue={trending} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Releases</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {newest.map((song) => (
            <SongCard key={song.id} song={song} queue={newest} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Artists</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredArtists.map((artist) => (
            <Link key={artist.id} to={`/artists/${artist.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{artist.name}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{artist.totalSongs} songs</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Explore Genres</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredGenres.map((genre) => (
            <Link
              key={genre.id}
              to={`/genres/${genre.id}`}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 dark:bg-slate-900 dark:ring-slate-700"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{genre.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{genre.songCount} songs</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
