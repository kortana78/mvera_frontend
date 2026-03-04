import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { BottomPlayer } from "./BottomPlayer";
import { AdminIcon, GenreIcon, HomeIcon, ProfileIcon, SearchIcon } from "./Icons";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-md px-2 py-2 text-xs font-medium sm:px-3 sm:text-sm ${
    isActive ? "bg-brand-500 text-black" : "text-slate-700 hover:bg-orange-100"
  }`;

export function Layout() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const displayName = user?.name === "Default User" ? "Member" : user?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <header className="border-b border-orange-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-black tracking-tight text-brand-600">
              MVERA
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-brand-700 sm:hidden"
            >
              Menu
            </button>
          </div>
          <nav className={`${isMobileMenuOpen ? "mt-3 flex" : "hidden"} w-full flex-col gap-2 sm:mt-3 sm:flex sm:flex-row sm:items-center sm:gap-2`}>
            <NavLink to="/" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="inline-flex items-center gap-1">
                <HomeIcon />
                Browse
              </span>
            </NavLink>
            <NavLink to="/search" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="inline-flex items-center gap-1">
                <SearchIcon />
                Search
              </span>
            </NavLink>
            <NavLink to="/genres" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
              <span className="inline-flex items-center gap-1">
                <GenreIcon />
                Genres
              </span>
            </NavLink>
            {user ? (
              <NavLink to="/profile" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
                <span className="inline-flex items-center gap-1">
                  <ProfileIcon />
                  Profile
                </span>
              </NavLink>
            ) : null}
            {user?.role === "admin" ? (
              <NavLink to="/admin" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
                <span className="inline-flex items-center gap-1">
                  <AdminIcon />
                  Admin
                </span>
              </NavLink>
            ) : null}
            {user ? (
              <>
                <span className="hidden px-2 text-sm font-medium text-slate-700 sm:inline">{displayName}</span>
                <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="whitespace-nowrap rounded-md bg-brand-500 px-3 py-2 text-xs font-medium text-black sm:text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navItemClass} onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 pb-32 sm:py-8">
        <Outlet />
      </main>
      <BottomPlayer />
    </div>
  );
}
