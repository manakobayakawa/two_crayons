import { BookScreen } from "@/components/BookScreen";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookScreen bookId={decodeURIComponent(id).replace(/[^a-z0-9-]/gi, "").slice(0, 40)} />;
}
