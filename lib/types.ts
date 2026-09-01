export type SubjectSlug = 'mathematics' | 'physics';

export type Role = 'reader' | 'contributor' | 'author' | 'admin';

export interface Subject {
  id: string;
  slug: SubjectSlug;
  name: string;
  description: string;
}

export interface Course {
  id: string;
  subjectSlug: SubjectSlug;
  slug: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  estimatedHours: number;
  authors: string[];
  contributors: string[];
  updatedAt: string;
}

export interface Lesson {
  id: string;
  subjectSlug: SubjectSlug;
  courseSlug: string;
  slug: string;
  title: string;
  orderIndex: number;
  markdown: string;
  readingMinutes: number;
}

export interface LibraryData {
  subjects: Subject[];
  courses: Course[];
  lessons: Lesson[];
}
