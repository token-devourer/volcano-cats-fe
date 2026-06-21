// Local UI state — hand selection, targeting intent, the declare-type
// picker, private peek reveals, toasts, and overlay toggles. None of this
// is authoritative game state; it's ephemeral interaction state.
"use client";
import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Card, CardType, GangCombo, PeekMode } from "@/lib/shared";
import type { ToastData, ToastTone } from "@/components/ui";

/** What the player is currently trying to target (chosen before sending). */
export type Targeting =
  | { mode: "single"; cardId: string }
  | { mode: "gang"; cardIds: string[]; combo: GangCombo; declaredType?: CardType }
  | null;

interface PeekState {
  open: boolean;
  mode: PeekMode;
  cards: Card[];
}

interface UIState {
  // hand multi-select (gang building)
  selectedIds: string[];
  toggleSelect: (id: string) => void;
  clearSelect: () => void;

  // targeting a player before sending PLAY / PLAY_GANG
  targeting: Targeting;
  startTargeting: (t: NonNullable<Targeting>) => void;
  cancelTargeting: () => void;

  // triple-gang "name a card type" picker
  declarePicker: { cardIds: string[] } | null;
  openDeclare: (cardIds: string[]) => void;
  closeDeclare: () => void;

  // private reveal modal (Spy / Peek&Swap / Pickpocket)
  peek: PeekState;
  openPeek: (mode: PeekMode, cards: Card[]) => void;
  closePeek: () => void;

  // toasts
  toasts: ToastData[];
  pushToast: (tone: ToastTone, text: string, icon?: string) => void;
  dismissToast: (id: string) => void;

  // overlays
  showLog: boolean;
  toggleLog: () => void;
  showRules: boolean;
  setRules: (open: boolean) => void;

  reset: () => void;
}

export const useUI = create<UIState>((set) => ({
  selectedIds: [],
  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  clearSelect: () => set({ selectedIds: [] }),

  targeting: null,
  startTargeting: (t) => set({ targeting: t }),
  cancelTargeting: () => set({ targeting: null }),

  declarePicker: null,
  openDeclare: (cardIds) => set({ declarePicker: { cardIds } }),
  closeDeclare: () => set({ declarePicker: null }),

  peek: { open: false, mode: "spy", cards: [] },
  openPeek: (mode, cards) => set({ peek: { open: true, mode, cards } }),
  closePeek: () => set((s) => ({ peek: { ...s.peek, open: false } })),

  toasts: [],
  pushToast: (tone, text, icon) =>
    set((s) => ({ toasts: [...s.toasts, { id: nanoid(), tone, text, icon }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  showLog: false,
  toggleLog: () => set((s) => ({ showLog: !s.showLog })),
  showRules: false,
  setRules: (showRules) => set({ showRules }),

  reset: () =>
    set({
      selectedIds: [],
      targeting: null,
      declarePicker: null,
      peek: { open: false, mode: "spy", cards: [] },
      showLog: false,
      showRules: false,
    }),
}));
