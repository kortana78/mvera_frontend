import { api } from "./client";
import type { Artist, Comment, Genre, Song, User } from "../types";

interface ApiSong {
  id: string | number;
  title: string;
  artist_id: string | number;
  artist_name: string;
  genre_id: string | number;
  genre_name: string;
  audio_path: string;
  cover_image?: string | null;
  views: number;
  downloads: number;
  likes_count?: number;
  comments_count?: number;
  created_at?: string;
}

interface ApiArtist {
  id: string | number;
  name: string;
  biography: string;
  profile_image?: string | null;
  social_links?: string[];
  total_songs: number;
  total_views: number;
}

interface ApiGenre {
  id: string | number;
  name: string;
  song_count: number;
}

interface ApiUser {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "user";
  banned: boolean;
  created_at?: string;
}

interface ApiComment {
  id: string | number;
  song_id: string | number;
  user_id: string | number;
  user_name: string;
  content: string;
  created_at: string;
}

const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");

function toMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/media/")) return `${apiBase}${path}`;
  return `${apiBase}/media/${path}`;
}

function mapSong(raw: ApiSong): Song {
  return {
    id: String(raw.id),
    title: raw.title,
    artistId: String(raw.artist_id),
    artistName: raw.artist_name,
    genreId: String(raw.genre_id),
    genreName: raw.genre_name,
    views: Number(raw.views || 0),
    downloads: Number(raw.downloads || 0),
    likesCount: Number(raw.likes_count || 0),
    commentsCount: Number(raw.comments_count || 0),
    coverImage: toMediaUrl(raw.cover_image),
    audioUrl: undefined,
    createdAt: raw.created_at
  };
}

function mapGenre(raw: ApiGenre): Genre {
  return {
    id: String(raw.id),
    name: raw.name,
    songCount: Number(raw.song_count || 0)
  };
}

function mapArtist(raw: ApiArtist): Artist {
  return {
    id: String(raw.id),
    name: raw.name,
    biography: raw.biography,
    profileImage: toMediaUrl(raw.profile_image),
    socialLinks: raw.social_links || [],
    totalSongs: Number(raw.total_songs || 0),
    totalViews: Number(raw.total_views || 0)
  };
}

function mapUser(raw: ApiUser): User {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    role: raw.role,
    banned: Boolean(raw.banned),
    createdAt: raw.created_at
  };
}

function mapComment(raw: ApiComment): Comment {
  return {
    id: String(raw.id),
    songId: String(raw.song_id),
    userId: String(raw.user_id),
    userName: raw.user_name,
    content: raw.content,
    createdAt: raw.created_at
  };
}

export async function listSongs(search?: string, genreId?: string): Promise<Song[]> {
  const response = await api.get<ApiSong[]>("/music", { params: { q: search, genre_id: genreId } });
  return (response.data || []).map(mapSong);
}

export async function getSong(songId: string): Promise<Song> {
  const response = await api.get<ApiSong>(`/music/${songId}`);
  return mapSong(response.data);
}

export async function createSong(payload: {
  title: string;
  artistId: string;
  genreId: string;
  audioPath: string;
  coverImage?: string;
}): Promise<Song> {
  const response = await api.post<ApiSong>("/music", {
    title: payload.title,
    artist_id: payload.artistId,
    genre_id: payload.genreId,
    audio_path: payload.audioPath,
    cover_image: payload.coverImage
  });
  return mapSong(response.data);
}

export async function updateSong(
  songId: string,
  payload: Partial<{ title: string; artistId: string; genreId: string; audioPath: string; coverImage: string }>
): Promise<Song> {
  const response = await api.patch<ApiSong>(`/music/${songId}`, {
    title: payload.title,
    artist_id: payload.artistId,
    genre_id: payload.genreId,
    audio_path: payload.audioPath,
    cover_image: payload.coverImage
  });
  return mapSong(response.data);
}

export async function deleteSong(songId: string): Promise<void> {
  await api.delete(`/music/${songId}`);
}

export async function listGenres(): Promise<Genre[]> {
  const response = await api.get<ApiGenre[]>("/genres");
  return (response.data || []).map(mapGenre);
}

export async function createGenre(name: string): Promise<Genre> {
  const response = await api.post<ApiGenre>("/genres", { name });
  return mapGenre(response.data);
}

export async function updateGenre(genreId: string, name: string): Promise<Genre> {
  const response = await api.patch<ApiGenre>(`/genres/${genreId}`, { name });
  return mapGenre(response.data);
}

export async function deleteGenre(genreId: string): Promise<void> {
  await api.delete(`/genres/${genreId}`);
}

export async function listArtists(): Promise<Artist[]> {
  const response = await api.get<ApiArtist[]>("/artists");
  return (response.data || []).map(mapArtist);
}

export async function getArtist(artistId: string): Promise<Artist> {
  const response = await api.get<ApiArtist>(`/artists/${artistId}`);
  return mapArtist(response.data);
}

export async function createArtist(payload: {
  name: string;
  biography: string;
  profileImage?: string;
  socialLinks?: string[];
}): Promise<Artist> {
  const response = await api.post<ApiArtist>("/artists", {
    name: payload.name,
    biography: payload.biography,
    profile_image: payload.profileImage,
    social_links: payload.socialLinks || []
  });
  return mapArtist(response.data);
}

export async function updateArtist(
  artistId: string,
  payload: Partial<{ name: string; biography: string; profileImage: string; socialLinks: string[] }>
): Promise<Artist> {
  const response = await api.patch<ApiArtist>(`/artists/${artistId}`, {
    name: payload.name,
    biography: payload.biography,
    profile_image: payload.profileImage,
    social_links: payload.socialLinks
  });
  return mapArtist(response.data);
}

export async function deleteArtist(artistId: string): Promise<void> {
  await api.delete(`/artists/${artistId}`);
}

export async function listUsers(): Promise<User[]> {
  const response = await api.get<ApiUser[]>("/admin/users");
  return (response.data || []).map(mapUser);
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}): Promise<User> {
  const response = await api.post<ApiUser>("/admin/users", payload);
  return mapUser(response.data);
}

export async function updateUser(userId: string, payload: Partial<{ name: string; email: string; password: string; role: "admin" | "user"; banned: boolean }>): Promise<User> {
  const response = await api.patch<ApiUser>(`/admin/users/${userId}`, payload);
  return mapUser(response.data);
}

export async function banUser(userId: string): Promise<User> {
  const response = await api.post<ApiUser>(`/admin/users/${userId}/ban`);
  return mapUser(response.data);
}

export async function unbanUser(userId: string): Promise<User> {
  const response = await api.post<ApiUser>(`/admin/users/${userId}/unban`);
  return mapUser(response.data);
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

export async function toggleSongLike(songId: string): Promise<{ liked: boolean; likesCount: number }> {
  const response = await api.post<{ liked: boolean; likes_count: number }>(`/music/${songId}/like`);
  return { liked: Boolean(response.data.liked), likesCount: Number(response.data.likes_count || 0) };
}

export async function listSongComments(songId: string): Promise<Comment[]> {
  const response = await api.get<ApiComment[]>(`/music/${songId}/comments`);
  return (response.data || []).map(mapComment);
}

export async function addSongComment(songId: string, content: string): Promise<Comment> {
  const response = await api.post<ApiComment>(`/music/${songId}/comments`, { content });
  return mapComment(response.data);
}

export async function uploadImage(file: File): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{ path: string; url: string }>("/uploads/image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return { path: response.data.path, url: `${apiBase}${response.data.url}` };
}

export async function uploadAudio(file: File): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{ path: string; url: string }>("/uploads/audio", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return { path: response.data.path, url: `${apiBase}${response.data.url}` };
}
