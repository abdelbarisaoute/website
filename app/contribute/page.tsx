import Link from 'next/link';

export default function ContributePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold">Contribute</h1>
      <p className="mt-3 text-[var(--muted)]">Readers can apply to become contributors and submit suggestions for review.</p>
      <Link href="/contribute/apply" className="mt-5 inline-block rounded border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
        Apply as contributor
      </Link>
    </main>
  );
}
