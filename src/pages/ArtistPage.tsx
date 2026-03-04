import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtist, listSongs } from "../api/music";
import { SongCard } from "../components/SongCard";
import type { Artist, Song } from "../types";

export function ArtistPage() {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!artistId) return;
    getArtist(artistId).then(setArtist);
    listSongs().then((all) => setSongs(all.filter((song) => song.artistId === artistId)));
    const ids = JSON.parse(localStorage.getItem("mvera_followed_artist_ids") || "[]") as string[];
    setFollowing(ids.includes(artistId));
  }, [artistId]);

  function toggleFollow() {
    if (!artistId) return;
    const ids = new Set(JSON.parse(localStorage.getItem("mvera_followed_artist_ids") || "[]") as string[]);
    if (ids.has(artistId)) {
      ids.delete(artistId);
      setFollowing(false);
    } else {
      ids.add(artistId);
      setFollowing(true);
    }
    localStorage.setItem("mvera_followed_artist_ids", JSON.stringify(Array.from(ids)));
  }

  if (!artist) return <p className="text-sm text-slate-500">Loading artist profile...</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {artist.profileImage ? <img src={artist.profileImage} alt={artist.name} className="mb-3 h-28 w-28 rounded-xl object-cover sm:h-40 sm:w-40" /> : null}
            <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{artist.name}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{artist.biography}</p>
          </div>
          <button onClick={toggleFollow} className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white sm:w-auto">
            {following ? "Following" : "Follow"}
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-orange-50 p-4 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">Songs</p>
            <p className="mt-1 text-brand-700">{artist.totalSongs}</p>
          </div>
          <div className="rounded-xl bg-orange-50 p-4 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">Total Views</p>
            <p className="mt-1 text-brand-700">{artist.totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Songs by {artist.name}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
          {songs.length === 0 ? <p className="text-sm text-slate-500">No songs available for this artist yet.</p> : null}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="font-semibold text-slate-900 dark:text-white">Social Links</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {artist.socialLinks.map((link) => (
            <a key={link} href={link} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {link}
            </a>
          ))}
          {artist.socialLinks.length === 0 ? <p className="text-slate-500">No social links.</p> : null}
        </div>
      </div>
    </section>
  );
}
