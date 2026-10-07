import Link from 'next/link';

export default function MyLearningPage() {
  const links = [
    { href: '/me/progress', label: 'Progress' },
    { href: '/me/bookmarks', label: 'Bookmarks' },
    { href: '/me/notes', label: 'Notes' },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold">My Learning</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Reader dashboard scaffold with persistent data model support in place.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded border border-[var(--border)] bg-[var(--surface)] p-4">
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
