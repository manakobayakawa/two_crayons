import { Home } from "@/components/Home";
import { resolveLiveKey } from "@/lib/key";

export const dynamic = "force-dynamic";

export default function Page() {
  return <Home keyProblem={resolveLiveKey().problem} />;
}
