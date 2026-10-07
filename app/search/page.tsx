import Link from 'next/link';

async function search(q: string) {
  if (!q) return [];
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/search?q=${encodeURIComponent(q)}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return [];
  return (await response.json()) as Array<{ href: string; title: string; snippet: string; subject: string }>;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const results = await search(q);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold">Search</h1>
      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search lessons, courses, equations, topics..."
          className="w-full rounded border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
        />
      </form>
      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <article key={result.href} className="rounded border border-[var(--border)] bg-[var(--surface)] p-4">
            <Link href={result.href} className="text-lg font-medium text-[var(--accent)] hover:underline">
              {result.title}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--muted)]">{result.subject}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{result.snippet}</p>
          </article>
        ))}
        {q && results.length === 0 ? <p className="text-sm text-[var(--muted)]">No results found.</p> : null}
      </div>
    </main>
  );
}
