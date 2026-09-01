export default async function SuggestionPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-semibold">Suggest an improvement</h1>
      <p className="mt-3 text-[var(--muted)]">Lesson: {lesson}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">Suggestion submission endpoint will be connected in contribution phase.</p>
    </main>
  );
}
