import type { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import type { Item, Meta, Page, Presence, Reaction } from "@/lib/types";

declare global {
  interface Liveblocks {
    Presence: Presence;
    Storage: {
      meta: LiveObject<Meta>;
      pages: LiveList<LiveObject<Page>>;
      items: LiveMap<string, LiveObject<Item>>;
    };
    RoomEvent: Reaction;
  }
}

export {};
