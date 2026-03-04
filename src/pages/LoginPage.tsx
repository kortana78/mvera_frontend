import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch {
      setError("Login failed. Check your email/password.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Login</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        No account?{" "}
        <Link to="/signup" className="font-semibold text-brand-700">
          Sign up
        </Link>
      </p>
    </section>
  );
}
