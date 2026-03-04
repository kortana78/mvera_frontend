import { api } from "./client";
import type { User } from "../types";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

function mapUser(raw: any): User {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    role: raw.role,
    banned: Boolean(raw.banned)
  };
}

export async function login(email: string, password: string): Promise<string> {
  const response = await api.post<TokenResponse>("/auth/login", { email, password });
  return response.data.access_token;
}

export async function signup(name: string, email: string, password: string): Promise<string> {
  const response = await api.post<TokenResponse>("/auth/signup", { name, email, password });
  return response.data.access_token;
}

export async function me(): Promise<User> {
  const response = await api.get("/auth/me");
  return mapUser(response.data);
}
