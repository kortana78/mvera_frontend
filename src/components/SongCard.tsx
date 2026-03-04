import { type FormEvent, useEffect, useState } from "react";
import { addSongComment, listSongComments, toggleSongLike } from "../api/music";
import { useAuth } from "../auth/AuthContext";
import { CommentIcon, LikeIcon, PlayIcon, QueueIcon } from "./Icons";
import { usePlayer } from "../player/PlayerContext";
import type { Comment, Song } from "../types";

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export function SongCard({ song, queue }: SongCardProps) {
  const { user } = useAuth();
  const { addToQueue, playNow } = usePlayer();
  const [likesCount, setLikesCount] = useState(song.likesCount || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const likedIds = JSON.parse(localStorage.getItem("mvera_liked_song_ids") || "[]") as string[];
    setLiked(likedIds.includes(song.id));
    const ratingsMap = JSON.parse(localStorage.getItem("mvera_song_ratings") || "{}") as Record<string, number[]>;
    const songRatings = ratingsMap[song.id] || [];
    if (songRatings.length > 0) {
      setAverageRating(songRatings.reduce((acc, n) => acc + n, 0) / songRatings.length);
    }
  }, [song.id]);

  async function onLike() {
    if (!user) return;
    const result = await toggleSongLike(song.id);
    setLiked(result.liked);
    setLikesCount(result.likesCount);
    const likedIds = new Set(JSON.parse(localStorage.getItem("mvera_liked_song_ids") || "[]") as string[]);
    if (result.liked) {
      likedIds.add(song.id);
    } else {
      likedIds.delete(song.id);
    }
    localStorage.setItem("mvera_liked_song_ids", JSON.stringify(Array.from(likedIds)));
  }

  async function onToggleComments() {
    const next = !showComments;
    setShowComments(next);
    if (next) {
      const data = await listSongComments(song.id);
      setComments(data);
    }
  }

  async function onAddComment(e: FormEvent) {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    const created = await addSongComment(song.id, commentText.trim());
    setComments((prev) => [created, ...prev]);
    const recent = JSON.parse(localStorage.getItem("mvera_recent_comments") || "[]") as Comment[];
    localStorage.setItem("mvera_recent_comments", JSON.stringify([created, ...recent].slice(0, 40)));
    setCommentText("");
  }

  function onRate(value: number) {
    setRating(value);
    const ratingsMap = JSON.parse(localStorage.getItem("mvera_song_ratings") || "{}") as Record<string, number[]>;
    const songRatings = ratingsMap[song.id] || [];
    const updated = [...songRatings, value].slice(-200);
    ratingsMap[song.id] = updated;
    localStorage.setItem("mvera_song_ratings", JSON.stringify(ratingsMap));
    setAverageRating(updated.reduce((acc, n) => acc + n, 0) / updated.length);
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-sm">
      {song.coverImage ? <img src={song.coverImage} alt={song.title} className="mb-3 h-40 w-full rounded-xl object-cover" /> : null}
      <h3 className="text-lg font-bold text-white">{song.title}</h3>
      <p className="text-sm text-slate-300">{song.artistName}</p>
      <p className="text-sm text-slate-400">{song.genreName}</p>
      <p className="mt-2 text-sm font-medium text-brand-700">{song.views.toLocaleString()} views</p>
      <p className="text-sm text-slate-300">{likesCount.toLocaleString()} likes</p>
      <p className="text-sm text-slate-300">Rating: {averageRating ? averageRating.toFixed(1) : "N/A"} / 5</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => playNow(song, queue)} className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-black">
          <span className="inline-flex items-center gap-1">
            <PlayIcon />
            Play
          </span>
        </button>
        <button onClick={() => addToQueue(song)} className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1">
            <QueueIcon />
            Queue
          </span>
        </button>
        <a
          href={`http://localhost:8000/api/music/${song.id}/download`}
          className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white"
        >
          Download
        </a>
        <button
          onClick={onLike}
          disabled={!user}
          className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-black disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <span className="inline-flex items-center gap-1">
            <LikeIcon />
            {liked ? "Unlike" : "Like"}
          </span>
        </button>
        <button onClick={onToggleComments} className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1">
            <CommentIcon />
            Comments
          </span>
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            onClick={() => onRate(v)}
            className={`rounded px-2 py-1 text-xs font-semibold ${rating >= v ? "bg-amber-400 text-slate-900" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200"}`}
          >
            {v}
          </button>
        ))}
      </div>
      {showComments ? (
        <div className="mt-4 space-y-3">
          <form onSubmit={onAddComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? "Write a comment..." : "Login to comment"}
              disabled={!user}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={!user || !commentText.trim()}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:bg-slate-300"
            >
              Post
            </button>
          </form>
          <div className="max-h-40 space-y-2 overflow-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">{comment.userName}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 ? <p className="text-xs text-slate-500">No comments yet.</p> : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
