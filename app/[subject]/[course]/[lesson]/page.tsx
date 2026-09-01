import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LessonToc } from '@/components/lesson-toc';
import { MathMarkdown } from '@/components/math-markdown';
import { getCourseBySlug, getLessonBySlug, subjectLabel } from '@/lib/content';
import type { SubjectSlug } from '@/lib/types';

function asSubjectSlug(subject: string): SubjectSlug | null {
  return subject === 'mathematics' || subject === 'physics' ? subject : null;
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ subject: string; course: string; lesson: string }>;
}) {
  const { subject, course, lesson } = await params;
  const subjectSlug = asSubjectSlug(subject);
  if (!subjectSlug) return notFound();

  const [courseData, lessonData] = await Promise.all([
    getCourseBySlug(subjectSlug, course),
    getLessonBySlug(subjectSlug, course, lesson),
  ]);

  if (!courseData || !lessonData) return notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <nav className="mb-4 text-xs text-[var(--muted)]">
        <Link href={`/${subjectSlug}`}>{subjectLabel(subjectSlug)}</Link> /{' '}
        <Link href={`/${subjectSlug}/${courseData.slug}`}>{courseData.title}</Link> / {lessonData.title}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)_14rem]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="mb-3 text-sm font-medium">Contents</h2>
            <LessonToc />
          </div>
        </aside>

        <section className="rounded border border-[var(--border)] bg-[var(--surface)] px-5 py-6 md:px-8">
          <header className="mb-6 border-b border-[var(--border)] pb-4">
            <h1 className="text-3xl font-semibold">{lessonData.title}</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Estimated reading time: {lessonData.readingMinutes} minutes</p>
          </header>
          <MathMarkdown markdown={lessonData.markdown} />
        </section>

        <aside className="space-y-3">
          <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm font-medium">Reading tools</p>
            <p className="mt-2 text-xs text-[var(--muted)]">Bookmark, notes, and progress actions are scaffolded in Phase 1.</p>
          </div>
          <details className="rounded border border-[var(--border)] bg-[var(--surface)] p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium">Contents</summary>
            <div className="mt-3">
              <LessonToc />
            </div>
          </details>
        </aside>
      </div>
    </main>
  );
}
