import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { listSongs } from "../api/music";
import { SongCard } from "../components/SongCard";
import type { Comment, Song } from "../types";

export function ProfilePage() {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem("mvera_liked_song_ids") || "[]") as string[];
    listSongs().then((songs) => {
      setLikedSongs(songs.filter((song) => liked.includes(song.id)));
    });
    const comments = JSON.parse(localStorage.getItem("mvera_recent_comments") || "[]") as Comment[];
    setRecentComments(comments.slice(0, 10));
  }, []);

  if (!user) {
    return <p className="text-sm text-slate-500">Login to view your profile.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{user.name}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
        <p className="mt-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">
          {user.role}
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Liked Songs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {likedSongs.map((song) => (
            <SongCard key={song.id} song={song} queue={likedSongs} />
          ))}
          {likedSongs.length === 0 ? <p className="text-sm text-slate-500">No liked songs yet.</p> : null}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Comments</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {recentComments.map((comment) => (
            <div key={comment.id} className="border-b border-slate-100 py-2 text-sm last:border-b-0 dark:border-slate-800">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{comment.userName}</p>
              <p className="text-slate-600 dark:text-slate-300">{comment.content}</p>
            </div>
          ))}
          {recentComments.length === 0 ? <p className="text-sm text-slate-500">No comments yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
