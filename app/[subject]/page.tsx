import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourses, subjectLabel } from '@/lib/content';
import type { SubjectSlug } from '@/lib/types';

function asSubjectSlug(subject: string): SubjectSlug | null {
  return subject === 'mathematics' || subject === 'physics' ? subject : null;
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const subjectSlug = asSubjectSlug(subject);
  if (!subjectSlug) return notFound();

  const courses = await getCourses(subjectSlug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold">{subjectLabel(subjectSlug)}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Available courses</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {courses.map((course) => (
          <Link key={course.id} href={`/${subjectSlug}/${course.slug}`} className="border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-medium">{course.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{course.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
