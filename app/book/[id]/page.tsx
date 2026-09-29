import { BookScreen } from "@/components/BookScreen";
import { resolveLiveKey } from "@/lib/key";

export const dynamic = "force-dynamic";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { key, problem } = resolveLiveKey();
  return <BookScreen bookId={decodeURIComponent(id).replace(/[^a-z0-9-]/gi, "").slice(0, 40)} liveKey={key} keyProblem={problem} />;
}
