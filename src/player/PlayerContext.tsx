import { createContext, useContext, useMemo, useState } from "react";
import type { Song } from "../types";

interface PlayerContextValue {
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  setQueue: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  playNow: (song: Song, queue?: Song[]) => void;
  playPause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (value: number) => void;
  onTrackEnded: () => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);

  function setQueue(songs: Song[]) {
    setQueueState(songs);
    if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
    }
  }

  function addToQueue(song: Song) {
    setQueueState((prev) => (prev.find((s) => s.id === song.id) ? prev : [...prev, song]));
    if (!currentSong) {
      setCurrentSong(song);
    }
  }

  function playNow(song: Song, newQueue?: Song[]) {
    if (newQueue && newQueue.length > 0) {
      setQueueState(newQueue);
    } else if (!queue.find((s) => s.id === song.id)) {
      setQueueState((prev) => [song, ...prev]);
    }
    setCurrentSong(song);
    setIsPlaying(true);
  }

  function playPause() {
    if (!currentSong && queue.length > 0) {
      setCurrentSong(queue[0]);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  }

  function next() {
    if (!currentSong || queue.length === 0) return;
    const index = queue.findIndex((s) => s.id === currentSong.id);
    const nextIndex = index >= 0 ? (index + 1) % queue.length : 0;
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  }

  function prev() {
    if (!currentSong || queue.length === 0) return;
    const index = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = index > 0 ? index - 1 : queue.length - 1;
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  }

  function setVolume(value: number) {
    setVolumeState(Math.min(1, Math.max(0, value)));
  }

  function onTrackEnded() {
    next();
  }

  const value = useMemo(
    () => ({ queue, currentSong, isPlaying, volume, setQueue, addToQueue, playNow, playPause, next, prev, setVolume, onTrackEnded }),
    [queue, currentSong, isPlaying, volume]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}
