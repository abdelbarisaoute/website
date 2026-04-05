export type Subject = 'Math' | 'Physics';
export type ContentType = 'course' | 'code';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  subject: Subject;
  description: string;
  content: string;
  language?: string;
  createdAt: string;
}
