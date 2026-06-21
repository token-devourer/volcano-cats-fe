"use client";
import { useState } from "react";
import { ResponsiveDialog, Button, Card as CardView, Avatar } from "@/components/ui";
import { useGame } from "@/store/game";
import { useUI } from "@/store/ui";
import { send } from "@/lib/net/client";
import { cardName, cardDesc, t } from "@/lib/i18n";
import { ALL_CARD_TYPES, type Card, type CardType } from "@/lib/shared";

// A reusable scrollable grid of cards to pick from.
function CardPicker({
  cards,
  onPick,
  emptyText,
}: {
  cards: Card[];
  onPick: (card: Card) => void;
  emptyText?: string;
}) {
  if (cards.length === 0) {
    return <p className="py-4 text-center text-sm text-ink-soft">{emptyText ?? t("game.emptyHand")}</p>;
  }
  return (
    <div className="flex max-h-[46vh] flex-wrap justify-center gap-2 overflow-y-auto py-1">
      {cards.map((c) => (
        <CardView
          key={c.id}
          card={c}
          name={cardName(c.type)}
          description={cardDesc(c.type)}
          size="sm"
          onActivate={() => onPick(c)}
        />
      ))}
    </div>
  );
}

// ----- await_bucket: place the drawn Lava Cat back into the deck -----
export function BucketModal() {
  const deckCount = useGame((s) => s.state?.deckCount ?? 0);
  const [pos, setPos] = useState(0);
  return (
    <ResponsiveDialog open title={t("game.placeBucket")} icon="💧" accent="lava" dismissable={false} onClose={() => {}}>
      <p className="mb-4 text-sm text-ink-soft">
        0 = paling atas (langsung ketemu lagi 😈), {deckCount} = paling bawah (aman 😌).
      </p>
      <input
        type="range"
        min={0}
        max={deckCount}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="w-full accent-lava"
        aria-label={t("game.placeBucket")}
      />
      <p className="mt-2 text-center font-display text-lg text-lava">Posisi {pos} dari atas</p>
      <Button variant="primary" size="lg" fullWidth className="mt-5" onClick={() => send({ t: "PLACE_BUCKET", position: pos })}>
        🌋 {t("action.confirm")}
      </Button>
    </ResponsiveDialog>
  );
}

// ----- await_favor: give a card of your choice -----
export function FavorModal({ initiatorName }: { initiatorName: string }) {
  const hand = useGame((s) => s.hand);
  return (
    <ResponsiveDialog open title={t("card.bribe.name")} icon="🎁" accent="gold" dismissable={false} onClose={() => {}}>
      <p className="mb-3 text-sm text-ink-soft">
        <span className="font-semibold text-ink">{initiatorName}</span> minta 1 kartu. Pilih yang mau kamu kasih.
      </p>
      <CardPicker cards={hand} onPick={(c) => send({ t: "GIVE_CARD", cardId: c.id })} />
    </ResponsiveDialog>
  );
}

// ----- await_peek_swap: decide whether to swap the revealed top card -----
export function PeekSwapModal() {
  const hand = useGame((s) => s.hand);
  const peek = useUI((s) => s.peek);
  const closePeek = useUI((s) => s.closePeek);
  const top = peek.cards[0];
  const decide = (swap: boolean, cardId?: string) => {
    send({ t: "PEEK_DECIDE", swap, cardId });
    closePeek();
  };
  return (
    <ResponsiveDialog open title={t("card.peekAndSwap.name")} icon="👁️" accent="gang-storm" dismissable={false} onClose={() => {}}>
      <p className="mb-2 text-sm text-ink-soft">Kartu teratas deck:</p>
      <div className="mb-4 flex justify-center">
        {top && <CardView card={top} name={cardName(top.type)} description={cardDesc(top.type)} size="md" />}
      </div>
      <p className="mb-2 text-sm text-ink-soft">Tukar dengan kartu dari tanganmu, atau lewati:</p>
      <CardPicker cards={hand} onPick={(c) => decide(true, c.id)} />
      <Button variant="outline" size="md" fullWidth className="mt-4" onClick={() => decide(false)}>
        {t("action.skip")}
      </Button>
    </ResponsiveDialog>
  );
}

// ----- await_flood: discard one card (or wait for others) -----
export function FloodModal() {
  const hand = useGame((s) => s.hand);
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  if (state?.phase.kind !== "await_flood") return null;
  const mustDiscard = myId ? state.phase.pending.includes(myId) : false;
  return (
    <ResponsiveDialog open title={t("card.flood.name")} icon="🌊" accent="gang-ice" dismissable={false} onClose={() => {}}>
      {mustDiscard ? (
        <>
          <p className="mb-3 text-sm text-ink-soft">Semua kena Flood — buang 1 kartu pilihanmu.</p>
          <CardPicker cards={hand} onPick={(c) => send({ t: "FLOOD_DISCARD", cardId: c.id })} />
        </>
      ) : (
        <p className="py-6 text-center text-sm text-ink-soft">{t("lobby.waiting")}</p>
      )}
    </ResponsiveDialog>
  );
}

// ----- await_timewarp: take a card from the discard pile -----
export function TimeWarpModal() {
  const discard = useGame((s) => s.state?.discardTop ?? []);
  return (
    <ResponsiveDialog open title={t("card.timeWarp.name")} icon="🪄" accent="gang-storm" dismissable={false} onClose={() => {}}>
      <p className="mb-3 text-sm text-ink-soft">Ambil 1 kartu dari buangan:</p>
      <CardPicker cards={[...discard].reverse()} onPick={(c) => send({ t: "TIMEWARP_PICK", cardId: c.id })} emptyText={t("game.discard")} />
    </ResponsiveDialog>
  );
}

// ----- await_pickpocket: take one card from the revealed target hand -----
export function PickpocketModal() {
  const peek = useUI((s) => s.peek);
  const closePeek = useUI((s) => s.closePeek);
  return (
    <ResponsiveDialog open title={t("card.pickpocket.name")} icon="💸" accent="lava" dismissable={false} onClose={() => {}}>
      <p className="mb-3 text-sm text-ink-soft">Tangan target — ambil 1 kartu:</p>
      <CardPicker
        cards={peek.cards}
        onPick={(c) => {
          send({ t: "PICKPOCKET_TAKE", cardId: c.id });
          closePeek();
        }}
      />
    </ResponsiveDialog>
  );
}

// ----- Spy reveal (no phase; just shows the peeked cards) -----
export function SpyModal() {
  const peek = useUI((s) => s.peek);
  const closePeek = useUI((s) => s.closePeek);
  if (!peek.open || peek.mode !== "spy") return null;
  return (
    <ResponsiveDialog open title={t("card.spyCat.name")} icon="🔭" accent="gang-storm" onClose={closePeek}>
      <p className="mb-3 text-sm text-ink-soft">3 kartu teratas (dari atas ke bawah):</p>
      <div className="flex justify-center gap-2">
        {peek.cards.map((c, i) => (
          <div key={c.id} className="flex flex-col items-center gap-1">
            <span className="text-xs text-ink-soft">{i + 1}</span>
            <CardView card={c} name={cardName(c.type)} description={cardDesc(c.type)} size="sm" />
          </div>
        ))}
      </div>
      <Button variant="primary" size="md" fullWidth className="mt-5" onClick={closePeek}>
        {t("action.confirm")}
      </Button>
    </ResponsiveDialog>
  );
}

// ----- Target picker (for single + gang actions needing a player) -----
export function TargetPicker() {
  const targeting = useUI((s) => s.targeting);
  const cancel = useUI((s) => s.cancelTargeting);
  const clearSelect = useUI((s) => s.clearSelect);
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  if (!targeting || !state) return null;

  const others = state.players.filter((p) => p.id !== myId && p.alive);

  const pick = (targetId: string) => {
    if (targeting.mode === "single") {
      send({ t: "PLAY", cardId: targeting.cardId, targetId });
    } else {
      send({ t: "PLAY_GANG", cardIds: targeting.cardIds, targetId, declaredType: targeting.declaredType });
    }
    cancel();
    clearSelect();
  };

  return (
    <ResponsiveDialog open title={t("game.pickTarget")} icon="🎯" accent="gold" onClose={cancel}>
      <div className="flex flex-col gap-2">
        {others.map((p) => (
          <button
            key={p.id}
            onClick={() => pick(p.id)}
            className="flex items-center gap-3 rounded-xl border border-panel-line bg-panel-2 px-3 py-2.5 text-left transition-colors hover:border-lava hover:bg-lava/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lava"
          >
            <Avatar name={p.name} size="sm" />
            <span className="flex-1 truncate text-ink">{p.name}</span>
            <span className="text-xs text-ink-soft">🂠 {p.handCount}</span>
          </button>
        ))}
      </div>
      <Button variant="outline" size="md" fullWidth className="mt-4" onClick={cancel}>
        {t("action.cancel")}
      </Button>
    </ResponsiveDialog>
  );
}

// ----- Declare type (triple gang: name a card type to steal) -----
export function DeclareTypeModal() {
  const declare = useUI((s) => s.declarePicker);
  const close = useUI((s) => s.closeDeclare);
  const startTargeting = useUI((s) => s.startTargeting);
  if (!declare) return null;

  const choose = (type: CardType) => {
    startTargeting({ mode: "gang", cardIds: declare.cardIds, combo: "triple", declaredType: type });
    close();
  };

  return (
    <ResponsiveDialog open title="Sebut Kartunya" icon="🎯" accent="gold" onClose={close}>
      <p className="mb-3 text-sm text-ink-soft">Sebut 1 jenis kartu — kalau target punya, kamu ambil.</p>
      <div className="grid max-h-[46vh] grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
        {ALL_CARD_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => choose(type)}
            className="rounded-lg border border-panel-line bg-panel-2 px-2 py-2 text-sm text-ink transition-colors hover:border-lava hover:bg-lava/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lava"
          >
            {cardName(type)}
          </button>
        ))}
      </div>
    </ResponsiveDialog>
  );
}
