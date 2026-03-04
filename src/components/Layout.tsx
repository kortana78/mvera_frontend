import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { BottomPlayer } from "./BottomPlayer";
import { AdminIcon, GenreIcon, HomeIcon, ProfileIcon, SearchIcon } from "./Icons";
import { useTheme } from "../theme/ThemeContext";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-brand-500 text-black" : "text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"
  }`;

export function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const displayName = user?.name === "Default User" ? "Member" : user?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <header className="border-b border-slate-800 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="text-2xl font-black tracking-tight text-brand-400">
            MVERA
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navItemClass}>
              <span className="inline-flex items-center gap-1">
                <HomeIcon />
                Browse
              </span>
            </NavLink>
            <NavLink to="/search" className={navItemClass}>
              <span className="inline-flex items-center gap-1">
                <SearchIcon />
                Search
              </span>
            </NavLink>
            <NavLink to="/genres" className={navItemClass}>
              <span className="inline-flex items-center gap-1">
                <GenreIcon />
                Genres
              </span>
            </NavLink>
            {user ? (
              <NavLink to="/profile" className={navItemClass}>
                <span className="inline-flex items-center gap-1">
                  <ProfileIcon />
                  Profile
                </span>
              </NavLink>
            ) : null}
            {user?.role === "admin" ? (
              <NavLink to="/admin" className={navItemClass}>
                <span className="inline-flex items-center gap-1">
                  <AdminIcon />
                  Admin
                </span>
              </NavLink>
            ) : null}
            {user ? (
              <>
                <span className="px-2 text-sm font-medium text-slate-200">{displayName}</span>
                <button onClick={toggleTheme} className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white">
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
                <button onClick={logout} className="rounded-md bg-brand-500 px-3 py-2 text-sm font-medium text-black">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={toggleTheme} className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white">
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
                <NavLink to="/login" className={navItemClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navItemClass}>
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 pb-28">
        <Outlet />
      </main>
      <BottomPlayer />
    </div>
  );
}
