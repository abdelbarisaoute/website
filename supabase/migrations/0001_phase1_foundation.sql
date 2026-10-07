-- Phase 1 foundation schema for Open Mathematics & Physics Library
create extension if not exists "pgcrypto";

create type role_kind as enum ('reader','contributor','author','admin');
create type publication_state as enum ('draft','review','published');
create type block_kind as enum (
  'paragraph','heading','equation','image','figure','table','code','quote',
  'definition','theorem','proof','example','remark','warning','exercise','solution','video','interactive_diagram'
);

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name role_kind unique not null
);

insert into roles(name)
values ('reader'),('contributor'),('author'),('admin')
on conflict (name) do nothing;

create table if not exists user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique(subject_id, slug)
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete restrict,
  category_id uuid references categories(id) on delete set null,
  slug text not null,
  title text not null,
  description text,
  difficulty text,
  prerequisites text[] not null default '{}',
  estimated_reading_hours int not null default 0,
  authors text[] not null default '{}',
  contributors text[] not null default '{}',
  publication_state publication_state not null default 'draft',
  content_tsv tsvector generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(subject_id, slug)
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique(course_id, slug)
);

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique(book_id, slug)
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete set null,
  course_id uuid references courses(id) on delete set null,
  slug text not null,
  title text not null,
  order_index int not null default 0,
  reading_minutes int not null default 0,
  content_markdown text not null default '',
  content_latex text,
  publication_state publication_state not null default 'draft',
  content_tsv tsvector generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content_markdown,''))) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, slug)
);

create table if not exists lesson_sections (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  heading text not null,
  anchor_slug text not null,
  order_index int not null default 0
);

create table if not exists content_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  section_id uuid references lesson_sections(id) on delete set null,
  block_type block_kind not null,
  order_index int not null,
  content jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  block_id uuid references content_blocks(id) on delete set null,
  prompt text not null,
  order_index int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists solutions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references exercises(id) on delete cascade,
  content_markdown text not null,
  is_collapsed_default boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists publications (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  version_no int not null,
  state publication_state not null,
  published_at timestamptz,
  published_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(lesson_id, version_no)
);

create table if not exists scheduled_publications (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  scheduled_for timestamptz not null,
  created_by uuid not null references auth.users(id),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text unique not null
);

create table if not exists lesson_tags (
  lesson_id uuid not null references lessons(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (lesson_id, tag_id)
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null,
  path text not null,
  mime_type text not null,
  bytes bigint not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(bucket, path)
);

create table if not exists lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  completed boolean not null default false,
  percent int not null default 0 check (percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists chapter_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references chapters(id) on delete cascade,
  percent int not null default 0 check (percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

create table if not exists bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists recently_viewed (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table if not exists contributor_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users(id) on delete cascade,
  motivation text not null,
  status text not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  section_anchor text,
  body text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists suggestion_comments (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references suggestions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists review_decisions (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references suggestions(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  decision text not null,
  rationale text,
  created_at timestamptz not null default now()
);

create table if not exists search_index_queue (
  id bigserial primary key,
  entity_type text not null,
  entity_id uuid not null,
  operation text not null,
  enqueued_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists courses_content_tsv_idx on courses using gin(content_tsv);
create index if not exists lessons_content_tsv_idx on lessons using gin(content_tsv);
create index if not exists lessons_course_idx on lessons(course_id, order_index);
create index if not exists chapters_book_idx on chapters(book_id, order_index);
create index if not exists books_course_idx on books(course_id, order_index);

alter table profiles enable row level security;
alter table user_roles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table bookmarks enable row level security;
alter table user_notes enable row level security;
alter table lesson_progress enable row level security;
alter table chapter_progress enable row level security;
alter table recently_viewed enable row level security;
alter table follows enable row level security;
alter table contributor_applications enable row level security;
alter table suggestions enable row level security;
alter table suggestion_comments enable row level security;
alter table review_decisions enable row level security;
alter table media_assets enable row level security;

create or replace function has_role(requested role_kind)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from user_roles ur
    join roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.name = requested
  );
$$;

create policy "public can read published courses" on courses
for select using (publication_state = 'published');

create policy "authors can manage courses" on courses
for all using (has_role('author') or has_role('admin'))
with check (has_role('author') or has_role('admin'));

create policy "public can read published lessons" on lessons
for select using (publication_state = 'published');

create policy "contributors can read draft lessons" on lessons
for select using (
  publication_state = 'review' or has_role('contributor') or has_role('author') or has_role('admin')
);

create policy "authors can manage lessons" on lessons
for all using (has_role('author') or has_role('admin'))
with check (has_role('author') or has_role('admin'));

create policy "user owns bookmarks" on bookmarks
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user owns notes" on user_notes
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user owns lesson progress" on lesson_progress
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user owns chapter progress" on chapter_progress
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user owns recent views" on recently_viewed
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user owns follows" on follows
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user can create own application" on contributor_applications
for insert with check (auth.uid() = applicant_id);

create policy "user can read own application" on contributor_applications
for select using (auth.uid() = applicant_id or has_role('author') or has_role('admin'));

create policy "authors can review applications" on contributor_applications
for update using (has_role('author') or has_role('admin'));

create policy "authenticated can create suggestion" on suggestions
for insert with check (auth.uid() = author_id);

create policy "authors or owner can view suggestions" on suggestions
for select using (auth.uid() = author_id or has_role('author') or has_role('admin'));

create policy "authors can manage suggestion status" on suggestions
for update using (has_role('author') or has_role('admin'));

create policy "suggestion participants can read comments" on suggestion_comments
for select using (
  has_role('author') or has_role('admin') or exists (
    select 1 from suggestions s where s.id = suggestion_id and s.author_id = auth.uid()
  )
);

create policy "participants can write comments" on suggestion_comments
for insert with check (
  auth.uid() = author_id and (
    has_role('author') or has_role('admin') or exists (
      select 1 from suggestions s where s.id = suggestion_id and s.author_id = auth.uid()
    )
  )
);

create policy "authors can create review decisions" on review_decisions
for insert with check (has_role('author') or has_role('admin'));

create policy "authors own media" on media_assets
for all using (auth.uid() = owner_id or has_role('author') or has_role('admin'))
with check (auth.uid() = owner_id or has_role('author') or has_role('admin'));
