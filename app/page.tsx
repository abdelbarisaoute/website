import Link from 'next/link';
import { getSubjects } from '@/lib/content';

export default async function HomePage() {
  const subjects = await getSubjects();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="space-y-6 border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Open academic library</p>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Learn mathematics and physics from structured, open lessons.
          </h1>
          <p className="max-w-3xl text-[var(--muted)]">
            Explore textbooks, courses, chapters, exercises, and interactive resources in one open learning library.
          </p>
        </div>
        <form action="/search" className="flex">
          <input
            name="q"
            placeholder="Search mathematics, physics, equations, topics..."
            className="w-full rounded border border-[var(--border)] bg-transparent px-4 py-3 text-sm"
          />
        </form>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {subjects.map((subject) => (
          <Link key={subject.id} href={`/${subject.slug}`} className="border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-slate-400">
            <h2 className="text-xl font-medium">{subject.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{subject.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
