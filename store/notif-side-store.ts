import { getNotifSideBar } from "@/lib/server/data/data-transaction";
import { TNotifSideBar } from "@/lib/type-data";
import { create } from "zustand";

type NotificationStore = {
  counts: TNotifSideBar;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;

  fetchNotifications: () => Promise<void>;
  resetNotifications: () => void;
};

export const useNotiSideStore = create<NotificationStore>((set) => ({
  counts: {
    in: 0,
    out: 0,
    check: 0,
  },
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await getNotifSideBar();

      if (!result.ok) {
        set({
          isLoading: false,
          error: "Failed to fetch notifications",
        });
        return;
      }

      set({
        counts: result.data ?? { in: 0, out: 0, check: 0 },
        isLoading: false,
        error: null,
        lastFetched: new Date(),
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },

  resetNotifications: () => {
    set({
      counts: { in: 0, out: 0, check: 0 },
      error: null,
      lastFetched: null,
    });
  },
}));
