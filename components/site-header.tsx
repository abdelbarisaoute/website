import Link from 'next/link';
import { signInWithGoogle, signOut } from '@/app/actions/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const navLinks = [
  { href: '/mathematics', label: 'Mathematics' },
  { href: '/physics', label: 'Physics' },
  { href: '/library', label: 'Library' },
  { href: '/about', label: 'About' },
  { href: '/contribute', label: 'Contribute' },
];

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Open M&P Library
        </Link>

        <nav className="hidden items-center gap-4 text-sm md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-[var(--muted)] hover:text-[var(--foreground)]">
              {link.label}
            </Link>
          ))}
          <Link href="/search" className="rounded border border-[var(--border)] px-3 py-1 text-[var(--muted)]">
            Search
          </Link>
          {user ? (
            <form action={signOut}>
              <button className="rounded bg-slate-900 px-3 py-1 text-white dark:bg-slate-100 dark:text-slate-900">
                Sign out
              </button>
            </form>
          ) : (
            <form action={signInWithGoogle}>
              <button className="rounded bg-slate-900 px-3 py-1 text-white dark:bg-slate-100 dark:text-slate-900">
                Sign in
              </button>
            </form>
          )}
        </nav>

        <details className="md:hidden">
          <summary className="cursor-pointer rounded border border-[var(--border)] px-2 py-1 text-sm">Menu</summary>
          <div className="absolute right-4 z-20 mt-2 min-w-48 rounded border border-[var(--border)] bg-[var(--surface)] p-3 shadow">
            <div className="flex flex-col gap-2 text-sm">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                  {link.label}
                </Link>
              ))}
              <Link href="/search">Search</Link>
              {user ? (
                <form action={signOut}>
                  <button className="w-full rounded border border-[var(--border)] px-2 py-1 text-left">Sign out</button>
                </form>
              ) : (
                <form action={signInWithGoogle}>
                  <button className="w-full rounded border border-[var(--border)] px-2 py-1 text-left">Sign in</button>
                </form>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
