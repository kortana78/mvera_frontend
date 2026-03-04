export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  genreId: string;
  genreName: string;
  views: number;
  downloads: number;
  likesCount: number;
  commentsCount: number;
  coverImage?: string;
  audioUrl?: string;
  createdAt?: string;
}

export interface Genre {
  id: string;
  name: string;
  songCount: number;
}

export interface Artist {
  id: string;
  name: string;
  biography: string;
  profileImage?: string;
  socialLinks: string[];
  totalSongs: number;
  totalViews: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  banned: boolean;
  createdAt?: string;
}

export interface Comment {
  id: string;
  songId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface AuthToken {
  accessToken: string;
  tokenType: string;
}

export interface PlaylistItem {
  song: Song;
  addedAt: number;
}
