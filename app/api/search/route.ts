import { NextResponse } from 'next/server';
import { getCourses, getLessonsByCourse } from '@/lib/content';
import type { SubjectSlug } from '@/lib/types';

function normalize(text: string) {
  return text.toLowerCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (!q) return NextResponse.json([]);

  const courses = await getCourses();
  const lessons = await Promise.all(
    courses.map((course) => getLessonsByCourse(course.subjectSlug, course.slug)),
  ).then((groups) => groups.flat());

  const needle = normalize(q);

  const courseResults = courses
    .filter((course) => normalize(`${course.title} ${course.description}`).includes(needle))
    .map((course) => ({
      href: `/${course.subjectSlug}/${course.slug}`,
      title: course.title,
      subject: course.subjectSlug,
      snippet: course.description,
      score: 2,
    }));

  const lessonResults = lessons
    .filter((lesson) => normalize(`${lesson.title} ${lesson.markdown}`).includes(needle))
    .map((lesson) => ({
      href: `/${lesson.subjectSlug}/${lesson.courseSlug}/${lesson.slug}`,
      title: lesson.title,
      subject: lesson.subjectSlug,
      snippet: lesson.markdown.replace(/[#*$`]/g, '').slice(0, 180),
      score: 3,
    }));

  const merged = [...lessonResults, ...courseResults]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ score: _score, ...rest }) => rest);

  return NextResponse.json(merged);
}
