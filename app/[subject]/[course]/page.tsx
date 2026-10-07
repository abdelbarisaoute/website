import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug, getLessonsByCourse, subjectLabel } from '@/lib/content';
import type { SubjectSlug } from '@/lib/types';

function asSubjectSlug(subject: string): SubjectSlug | null {
  return subject === 'mathematics' || subject === 'physics' ? subject : null;
}

export default async function CoursePage({ params }: { params: Promise<{ subject: string; course: string }> }) {
  const { subject, course } = await params;
  const subjectSlug = asSubjectSlug(subject);
  if (!subjectSlug) return notFound();

  const [courseData, lessons] = await Promise.all([
    getCourseBySlug(subjectSlug, course),
    getLessonsByCourse(subjectSlug, course),
  ]);

  if (!courseData) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <nav className="text-xs text-[var(--muted)]">
        <Link href={`/${subjectSlug}`}>{subjectLabel(subjectSlug)}</Link> / {courseData.title}
      </nav>
      <h1 className="mt-3 text-3xl font-semibold">{courseData.title}</h1>
      <p className="mt-2 max-w-3xl text-[var(--muted)]">{courseData.description}</p>

      <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-3"><dt className="text-[var(--muted)]">Difficulty</dt><dd>{courseData.difficulty}</dd></div>
        <div className="border border-[var(--border)] bg-[var(--surface)] p-3"><dt className="text-[var(--muted)]">Estimated</dt><dd>{courseData.estimatedHours} hours</dd></div>
        <div className="border border-[var(--border)] bg-[var(--surface)] p-3"><dt className="text-[var(--muted)]">Authors</dt><dd>{courseData.authors.join(', ')}</dd></div>
        <div className="border border-[var(--border)] bg-[var(--surface)] p-3"><dt className="text-[var(--muted)]">Contributors</dt><dd>{courseData.contributors.join(', ')}</dd></div>
      </dl>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-medium">Table of contents</h2>
        <ol className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link href={`/${subjectSlug}/${courseData.slug}/${lesson.slug}`} className="text-[var(--accent)] hover:underline">
                {lesson.orderIndex}. {lesson.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
