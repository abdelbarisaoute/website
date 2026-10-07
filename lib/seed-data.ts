import type { Course, Lesson, LibraryData, Subject } from './types';

const subjects: Subject[] = [
  {
    id: 's-math',
    slug: 'mathematics',
    name: 'Mathematics',
    description: 'Structured lessons in calculus, algebra, analysis, and more.',
  },
  {
    id: 's-physics',
    slug: 'physics',
    name: 'Physics',
    description: 'Concept-driven courses from mechanics to modern physics.',
  },
];

const courses: Course[] = [
  {
    id: 'c-calc-1',
    subjectSlug: 'mathematics',
    slug: 'calculus-i',
    title: 'Calculus I',
    description: 'Limits, continuity, derivatives, integrals, and foundational applications.',
    difficulty: 'Beginner',
    prerequisites: ['Precalculus', 'Trigonometry'],
    estimatedHours: 28,
    authors: ['Open Library Editorial Team'],
    contributors: ['Community Contributors'],
    updatedAt: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'c-classical-mechanics',
    subjectSlug: 'physics',
    slug: 'classical-mechanics',
    title: 'Classical Mechanics',
    description: 'A structured introduction to kinematics, dynamics, energy, and momentum.',
    difficulty: 'Beginner',
    prerequisites: ['Basic algebra', 'Basic trigonometry'],
    estimatedHours: 32,
    authors: ['Open Library Physics Team'],
    contributors: ['Physics Contributors'],
    updatedAt: '2026-08-22T00:00:00.000Z',
  },
];

const lessons: Lesson[] = [
  {
    id: 'l-limits',
    subjectSlug: 'mathematics',
    courseSlug: 'calculus-i',
    slug: 'limits',
    title: 'Limits',
    orderIndex: 1,
    readingMinutes: 18,
    markdown: `## Introduction\nLimits describe the behavior of a function near a point.\n\nIf $f(x)$ approaches $L$ as $x$ approaches $a$, we write:\n\n$$\n\\lim_{x \\to a} f(x) = L\n$$\n\n## One-sided limits\nWe distinguish left and right limits when needed.\n\n## Example\nFor $f(x)=x^2$,\n\n$$\n\\lim_{x \\to 2} x^2 = 4\n$$\n\n## Exercises\n1. Compute $\\lim_{x \\to 3} (2x+1)$.\n2. Determine whether $\\lim_{x \\to 0} \\frac{\\sin x}{x}$ exists.`,
  },
  {
    id: 'l-derivatives',
    subjectSlug: 'mathematics',
    courseSlug: 'calculus-i',
    slug: 'derivatives',
    title: 'Derivatives',
    orderIndex: 2,
    readingMinutes: 22,
    markdown: `## Definition\nThe derivative gives the instantaneous rate of change.\n\n$$\n\\frac{d}{dx}f(x)=\\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}\n$$\n\n## Power rule\nFor $f(x)=x^n$:\n\n$$\n\\frac{d}{dx}x^n = nx^{n-1}\n$$\n\n## Applications\nDerivatives model velocity, growth, and optimization.`,
  },
  {
    id: 'l-newtons-laws',
    subjectSlug: 'physics',
    courseSlug: 'classical-mechanics',
    slug: 'newtons-laws',
    title: "Newton's Laws",
    orderIndex: 1,
    readingMinutes: 24,
    markdown: `## Introduction\nNewton's laws connect force and motion.\n\n## First law\nA body remains at rest or in uniform motion unless acted on by a net external force.\n\n## Second law\n\n$$\n\\vec{F}=m\\vec{a}\n$$\n\n## Third law\nFor every action force there is an equal and opposite reaction force.\n\n## Exercises\n1. A $2\\,kg$ mass experiences $10\\,N$. Find acceleration.\n2. Draw the force pairs in a person-wall interaction.`,
  },
  {
    id: 'l-work-energy',
    subjectSlug: 'physics',
    courseSlug: 'classical-mechanics',
    slug: 'work-and-energy',
    title: 'Work and Energy',
    orderIndex: 2,
    readingMinutes: 20,
    markdown: `## Work\nWork done by a constant force is:\n\n$$\nW = \\vec{F} \\cdot \\vec{d}\n$$\n\n## Kinetic energy\n\n$$\nK = \\frac{1}{2}mv^2\n$$\n\n## Work-energy theorem\n\n$$\nW_{net}=\\Delta K\n$$`,
  },
];

export const fallbackLibraryData: LibraryData = { subjects, courses, lessons };
