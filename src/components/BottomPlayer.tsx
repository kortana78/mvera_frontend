import { useEffect, useRef, useState } from "react";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, QueueIcon } from "./Icons";
import { usePlayer } from "../player/PlayerContext";

export function BottomPlayer() {
  const { queue, currentSong, isPlaying, volume, playPause, next, prev, setVolume, onTrackEnded, playNow } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-black/95 px-4 py-3 backdrop-blur">
        <p className="mx-auto max-w-6xl text-sm text-slate-400">No track selected. Play a song to start.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-black/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{currentSong.title}</p>
          <p className="truncate text-xs text-slate-400">{currentSong.artistName}</p>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => {
              const value = Number(e.target.value);
              setProgress(value);
              if (audioRef.current) {
                audioRef.current.currentTime = value;
              }
            }}
            className="mt-1 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prev} className="rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
            <span className="inline-flex items-center gap-1">
              <PrevIcon />
              Prev
            </span>
          </button>
          <button onClick={playPause} className="rounded-md bg-brand-500 px-3 py-2 text-xs font-semibold text-black">
            <span className="inline-flex items-center gap-1">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
              {isPlaying ? "Pause" : "Play"}
            </span>
          </button>
          <button onClick={next} className="rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
            <span className="inline-flex items-center gap-1">
              <NextIcon />
              Next
            </span>
          </button>
          <button onClick={() => setShowQueue((prev) => !prev)} className="rounded-md bg-slate-800 px-3 py-2 text-xs font-semibold text-white">
            <span className="inline-flex items-center gap-1">
              <QueueIcon />
              Queue ({queue.length})
            </span>
          </button>
        </div>

        <div className="flex w-32 items-center gap-2">
          <span className="text-xs text-slate-400">Vol</span>
          <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audioUrl || `http://localhost:8000/api/music/${currentSong.id}/stream`}
        onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={onTrackEnded}
      />
      {showQueue ? (
        <div className="mx-auto mt-3 max-w-6xl rounded-lg border border-slate-800 bg-slate-950 p-2">
          <div className="max-h-36 overflow-auto">
            {queue.map((song) => (
              <button
                key={song.id}
                onClick={() => playNow(song)}
                className={`mb-1 flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs ${
                  currentSong.id === song.id ? "bg-brand-500/20 text-brand-200" : "bg-slate-900 text-slate-200"
                }`}
              >
                <span className="truncate pr-2">{song.title}</span>
                <span className="text-slate-500">{song.artistName}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
