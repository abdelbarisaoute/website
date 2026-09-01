'use client';

import { useEffect, useMemo, useState } from 'react';

interface TocItem {
  id: string;
  level: number;
  text: string;
}

export function LessonToc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('article h2, article h3')) as HTMLHeadingElement[];
    const mapped = headings.map((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? crypto.randomUUID();
      }
      return {
        id: heading.id,
        level: Number(heading.tagName.replace('H', '')),
        text: heading.textContent ?? 'Untitled section',
      };
    });
    setItems(mapped);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.5, 0.8] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  const grouped = useMemo(() => items, [items]);

  if (grouped.length === 0) {
    return <p className="text-sm text-[var(--muted)]">No sections yet.</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {grouped.map((item) => (
        <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
          <a
            href={`#${item.id}`}
            className={activeId === item.id ? 'text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
