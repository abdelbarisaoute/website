import { cache } from 'react';
import { fallbackLibraryData } from './seed-data';
import type { Course, Lesson, Subject, SubjectSlug } from './types';
import { createSupabaseServerClient } from './supabase/server';

function normalizeSubject(input: string): SubjectSlug | null {
  if (input === 'mathematics' || input === 'physics') return input;
  return null;
}

export const getSubjects = cache(async (): Promise<Subject[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('subjects')
      .select('id,slug,name,description')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((s) => ({
        id: s.id,
        slug: normalizeSubject(String(s.slug)) ?? 'mathematics',
        name: String(s.name),
        description: String(s.description ?? ''),
      }));
    }
  } catch {
    // fallback to seed data
  }

  return fallbackLibraryData.subjects;
});

export const getCourses = cache(async (subject?: SubjectSlug): Promise<Course[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from('courses')
      .select(
        'id,slug,title,description,difficulty,estimated_reading_hours,updated_at,subject:subjects(slug),prerequisites,authors,contributors',
      )
      .eq('publication_state', 'published')
      .order('title', { ascending: true });

    if (subject) {
      query = query.eq('subject.slug', subject);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data.map((c: any) => ({
        id: String(c.id),
        subjectSlug: normalizeSubject(String(c.subject?.slug ?? 'mathematics')) ?? 'mathematics',
        slug: String(c.slug),
        title: String(c.title),
        description: String(c.description ?? ''),
        difficulty: (c.difficulty ?? 'Beginner') as Course['difficulty'],
        prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites : [],
        estimatedHours: Number(c.estimated_reading_hours ?? 0),
        authors: Array.isArray(c.authors) ? c.authors : [],
        contributors: Array.isArray(c.contributors) ? c.contributors : [],
        updatedAt: String(c.updated_at ?? new Date().toISOString()),
      }));
    }
  } catch {
    // fallback to seed data
  }

  return subject
    ? fallbackLibraryData.courses.filter((course) => course.subjectSlug === subject)
    : fallbackLibraryData.courses;
});

export const getCourseBySlug = cache(async (subject: SubjectSlug, courseSlug: string): Promise<Course | null> => {
  const courses = await getCourses(subject);
  return courses.find((course) => course.slug === courseSlug) ?? null;
});

export const getLessonsByCourse = cache(async (subject: SubjectSlug, courseSlug: string): Promise<Lesson[]> => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('lessons')
      .select('id,slug,title,order_index,reading_minutes,content_markdown,course:courses!inner(slug,subject:subjects!inner(slug))')
      .eq('publication_state', 'published')
      .eq('course.slug', courseSlug)
      .eq('course.subject.slug', subject)
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((lesson: any) => ({
        id: String(lesson.id),
        subjectSlug: subject,
        courseSlug,
        slug: String(lesson.slug),
        title: String(lesson.title),
        orderIndex: Number(lesson.order_index ?? 0),
        markdown: String(lesson.content_markdown ?? ''),
        readingMinutes: Number(lesson.reading_minutes ?? 0),
      }));
    }
  } catch {
    // fallback to seed data
  }

  return fallbackLibraryData.lessons
    .filter((lesson) => lesson.subjectSlug === subject && lesson.courseSlug === courseSlug)
    .sort((a, b) => a.orderIndex - b.orderIndex);
});

export const getLessonBySlug = cache(
  async (subject: SubjectSlug, courseSlug: string, lessonSlug: string): Promise<Lesson | null> => {
    const lessons = await getLessonsByCourse(subject, courseSlug);
    return lessons.find((lesson) => lesson.slug === lessonSlug) ?? null;
  },
);

export function subjectLabel(slug: SubjectSlug): string {
  return slug === 'mathematics' ? 'Mathematics' : 'Physics';
}
