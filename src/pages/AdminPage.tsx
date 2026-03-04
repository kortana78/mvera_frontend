import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  banUser,
  createArtist,
  createGenre,
  createSong,
  createUser,
  deleteArtist,
  deleteGenre,
  deleteSong,
  deleteUser,
  listArtists,
  listGenres,
  listSongs,
  listUsers,
  uploadAudio,
  uploadImage,
  unbanUser
} from "../api/music";
import type { Artist, Genre, Song, User } from "../types";

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [message, setMessage] = useState("");

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" as "admin" | "user" });
  const [newArtist, setNewArtist] = useState({ name: "", biography: "", profileImage: "", socialLinks: "" });
  const [newGenre, setNewGenre] = useState("");
  const [newSong, setNewSong] = useState({ title: "", artistId: "", genreId: "", audioPath: "", coverImage: "" });
  const [artistImageUploading, setArtistImageUploading] = useState(false);
  const [songImageUploading, setSongImageUploading] = useState(false);
  const [songAudioUploading, setSongAudioUploading] = useState(false);

  async function loadAll() {
    const [usersData, songsData, artistsData, genresData] = await Promise.all([listUsers(), listSongs(), listArtists(), listGenres()]);
    setUsers(usersData);
    setSongs(songsData);
    setArtists(artistsData);
    setGenres(genresData);
  }

  useEffect(() => {
    void loadAll();
  }, []);

  const totalViews = useMemo(() => songs.reduce((acc, s) => acc + s.views, 0), [songs]);

  async function onCreateUser(e: FormEvent) {
    e.preventDefault();
    await createUser(newUser);
    setNewUser({ name: "", email: "", password: "", role: "user" });
    setMessage("User created.");
    await loadAll();
  }

  async function onCreateArtist(e: FormEvent) {
    e.preventDefault();
    await createArtist({
      name: newArtist.name,
      biography: newArtist.biography,
      profileImage: newArtist.profileImage || undefined,
      socialLinks: newArtist.socialLinks
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    });
    setNewArtist({ name: "", biography: "", profileImage: "", socialLinks: "" });
    setMessage("Artist created.");
    await loadAll();
  }

  async function onArtistImageSelected(file?: File | null) {
    if (!file) return;
    setArtistImageUploading(true);
    try {
      const uploaded = await uploadImage(file);
      setNewArtist((prev) => ({ ...prev, profileImage: uploaded.path }));
      setMessage("Artist image uploaded.");
    } finally {
      setArtistImageUploading(false);
    }
  }

  async function onCreateGenre(e: FormEvent) {
    e.preventDefault();
    await createGenre(newGenre);
    setNewGenre("");
    setMessage("Genre created.");
    await loadAll();
  }

  async function onCreateSong(e: FormEvent) {
    e.preventDefault();
    if (!newSong.audioPath) {
      setMessage("Upload audio file before creating song.");
      return;
    }
    await createSong({
      title: newSong.title,
      artistId: newSong.artistId,
      genreId: newSong.genreId,
      audioPath: newSong.audioPath,
      coverImage: newSong.coverImage || undefined
    });
    setNewSong({ title: "", artistId: "", genreId: "", audioPath: "", coverImage: "" });
    setMessage("Song created.");
    await loadAll();
  }

  async function onSongImageSelected(file?: File | null) {
    if (!file) return;
    setSongImageUploading(true);
    try {
      const uploaded = await uploadImage(file);
      setNewSong((prev) => ({ ...prev, coverImage: uploaded.path }));
      setMessage("Song cover uploaded.");
    } finally {
      setSongImageUploading(false);
    }
  }

  async function onSongAudioSelected(file?: File | null) {
    if (!file) return;
    setSongAudioUploading(true);
    try {
      const uploaded = await uploadAudio(file);
      setNewSong((prev) => ({ ...prev, audioPath: uploaded.path }));
      setMessage("Song audio uploaded.");
    } finally {
      setSongAudioUploading(false);
    }
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Manage users, songs, artists, and genres from one dashboard.
        </p>
        {message ? <p className="mt-2 text-sm font-semibold text-brand-700">{message}</p> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Users</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{users.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Songs</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{songs.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total Views</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalViews.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onCreateUser} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create User</h2>
          <div className="mt-3 space-y-2">
            <input value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} placeholder="Name" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <input type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} placeholder="Email" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <input type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} placeholder="Password" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <select value={newUser.role} onChange={(e) => setNewUser((p) => ({ ...p, role: e.target.value as "admin" | "user" }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Create User</button>
          </div>
        </form>

        <form onSubmit={onCreateGenre} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Genre</h2>
          <div className="mt-3 space-y-2">
            <input value={newGenre} onChange={(e) => setNewGenre(e.target.value)} placeholder="Genre name" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Create Genre</button>
          </div>
        </form>

        <form onSubmit={onCreateArtist} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Artist</h2>
          <div className="mt-3 space-y-2">
            <input value={newArtist.name} onChange={(e) => setNewArtist((p) => ({ ...p, name: e.target.value }))} placeholder="Artist name" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <textarea value={newArtist.biography} onChange={(e) => setNewArtist((p) => ({ ...p, biography: e.target.value }))} placeholder="Biography" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Choose artist picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => void onArtistImageSelected(e.target.files?.[0])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {artistImageUploading ? <p className="text-xs text-slate-500">Uploading picture...</p> : null}
            {newArtist.profileImage ? <p className="text-xs text-brand-700">Saved image: {newArtist.profileImage}</p> : null}
            <input value={newArtist.socialLinks} onChange={(e) => setNewArtist((p) => ({ ...p, socialLinks: e.target.value }))} placeholder="Social links (comma separated)" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Create Artist</button>
          </div>
        </form>

        <form onSubmit={onCreateSong} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Song</h2>
          <div className="mt-3 space-y-2">
            <input value={newSong.title} onChange={(e) => setNewSong((p) => ({ ...p, title: e.target.value }))} placeholder="Song title" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            <select value={newSong.artistId} onChange={(e) => setNewSong((p) => ({ ...p, artistId: e.target.value }))} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <option value="">Choose artist</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <select value={newSong.genreId} onChange={(e) => setNewSong((p) => ({ ...p, genreId: e.target.value }))} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              <option value="">Choose genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Choose audio file</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => void onSongAudioSelected(e.target.files?.[0])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {songAudioUploading ? <p className="text-xs text-slate-500">Uploading audio...</p> : null}
            {newSong.audioPath ? <p className="text-xs text-brand-700">Saved audio: {newSong.audioPath}</p> : null}
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Choose cover picture (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => void onSongImageSelected(e.target.files?.[0])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {songImageUploading ? <p className="text-xs text-slate-500">Uploading cover...</p> : null}
            {newSong.coverImage ? <p className="text-xs text-brand-700">Saved cover: {newSong.coverImage}</p> : null}
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Create Song</button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-600 dark:text-slate-300">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2">{u.name === "Default User" ? "Member" : u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2 capitalize">{u.role}</td>
                  <td className="py-2">{u.banned ? "Banned" : "Active"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button onClick={() => (u.banned ? unbanUser(u.id) : banUser(u.id)).then(loadAll)} className="rounded bg-slate-900 px-2 py-1 text-xs text-white">
                        {u.banned ? "Unban" : "Ban"}
                      </button>
                      <button onClick={() => deleteUser(u.id).then(loadAll)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Songs</h2>
          <ul className="mt-3 space-y-2">
            {songs.map((song) => (
              <li key={song.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                <span className="truncate">{song.title}</span>
                <button onClick={() => deleteSong(song.id).then(loadAll)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Artists / Genres</h2>
          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Artists</p>
          <ul className="mt-2 space-y-2">
            {artists.map((artist) => (
              <li key={artist.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                <span>{artist.name}</span>
                <button onClick={() => deleteArtist(artist.id).then(loadAll)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Genres</p>
          <ul className="mt-2 space-y-2">
            {genres.map((genre) => (
              <li key={genre.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                <span>{genre.name}</span>
                <button onClick={() => deleteGenre(genre.id).then(loadAll)} className="rounded bg-red-600 px-2 py-1 text-xs text-white">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
