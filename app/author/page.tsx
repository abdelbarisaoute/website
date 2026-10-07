import Link from 'next/link';

const entries = [
  ['Courses', '/author/courses'],
  ['Books', '/author/books'],
  ['Chapters', '/author/chapters'],
  ['Lessons', '/author/lessons'],
  ['Suggestions', '/author/suggestions'],
  ['Contributors', '/author/contributors'],
  ['Settings', '/author/settings'],
] as const;

export default function AuthorDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold">Author Dashboard</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Phase-1 author area scaffold with route structure and role-oriented separation.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {entries.map(([label, href]) => (
          <Link key={href} href={href} className="rounded border border-[var(--border)] bg-[var(--surface)] p-4">
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
