import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h1 className="text-2xl font-black text-slate-900">Page not found</h1>
      <Link to="/" className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
        Back to home
      </Link>
    </section>
  );
}
