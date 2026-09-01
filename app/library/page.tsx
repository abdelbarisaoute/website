import Link from 'next/link';
import { getCourses, getSubjects } from '@/lib/content';

export default async function LibraryPage() {
  const [subjects, courses] = await Promise.all([getSubjects(), getCourses()]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold">Library</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Browse mathematics and physics course collections.</p>

      <div className="mt-6 space-y-8">
        {subjects.map((subject) => {
          const group = courses.filter((course) => course.subjectSlug === subject.slug);
          return (
            <section key={subject.id} className="space-y-3">
              <h2 className="text-xl font-medium">{subject.name}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {group.map((course) => (
                  <Link
                    key={course.id}
                    href={`/${course.subjectSlug}/${course.slug}`}
                    className="border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{course.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
