"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Card, Button } from "@/components/ui";
import { useGame } from "@/store/game";
import { useUI } from "@/store/ui";
import { send } from "@/lib/net/client";
import { cardName, cardDesc, t } from "@/lib/i18n";
import { CARD_SPECS, isGangType, comboForCount, type GangCombo } from "@/lib/shared";

const COMBO_LABEL: Record<GangCombo, string> = {
  pair: "Pasangan",
  triple: "Trio",
  quad: "Kuartet",
  rainbow: "Rainbow 🌈",
};

/**
 * The player's hand: a horizontally scrollable fan. Tapping an action card
 * plays it (entering target selection if it needs a target); tapping gang
 * cards builds a combo shown in the action bar. Locked / off-turn hands are
 * visible but not playable.
 */
export function PlayerHand() {
  const hand = useGame((s) => s.hand);
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  const selected = useUI((s) => s.selectedIds);
  const toggleSelect = useUI((s) => s.toggleSelect);
  const clearSelect = useUI((s) => s.clearSelect);
  const startTargeting = useUI((s) => s.startTargeting);
  const openDeclare = useUI((s) => s.openDeclare);
  const reduce = useReducedMotion();

  if (!state) return null;
  const me = state.players.find((p) => p.id === myId);
  const isMyTurn = state.turnOrder[state.currentTurnIndex] === myId;
  const canPlay = !!me?.alive && isMyTurn && state.phase.kind === "turn" && !me.locked;

  // Current combo from the selection.
  const selectedCards = hand.filter((c) => selected.includes(c.id));
  const distinct = new Set(selectedCards.map((c) => c.type)).size;
  const combo =
    selectedCards.length >= 2 && selectedCards.every((c) => isGangType(c.type))
      ? comboForCount(selectedCards.length, distinct)
      : null;

  function onCardClick(cardId: string, type: (typeof hand)[number]["type"]) {
    if (!canPlay) return;
    if (isGangType(type)) {
      toggleSelect(cardId);
      return;
    }
    if (type === "FREEZE" || CARD_SPECS[type].role === "danger") return; // not directly playable
    const spec = CARD_SPECS[type];
    if (spec.target === "player") {
      startTargeting({ mode: "single", cardId });
    } else {
      send({ t: "PLAY", cardId });
    }
  }

  function playCombo() {
    if (!combo) return;
    const cardIds = selectedCards.map((c) => c.id);
    if (combo === "quad") {
      send({ t: "PLAY_GANG", cardIds });
      clearSelect();
    } else if (combo === "triple") {
      openDeclare(cardIds); // pick a card type to name, then target
    } else {
      startTargeting({ mode: "gang", cardIds, combo });
    }
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-hand bg-gradient-to-t from-obsidian via-obsidian/95 to-transparent pt-12"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      {/* Combo / status bar */}
      <div className="mx-auto mb-2 flex min-h-[2.5rem] w-full max-w-3xl items-center justify-center gap-3 px-4">
        {combo ? (
          <div className="flex items-center gap-3 animate-slide-up">
            <span className="text-sm text-gold">
              {COMBO_LABEL[combo]} ({selectedCards.length})
            </span>
            <Button variant="secondary" size="sm" onClick={playCombo}>
              {t("action.play")} Gang
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSelect}>
              {t("action.cancel")}
            </Button>
          </div>
        ) : selected.length > 0 ? (
          <span className="text-sm text-ash-light">
            Pilih kartu Gang sejenis untuk kombo… ({selected.length})
            <button className="ml-2 underline" onClick={clearSelect}>{t("action.cancel")}</button>
          </span>
        ) : !canPlay && me?.alive ? (
          <span className="text-sm text-ash-light">
            {me.locked ? t("error.LOCKED") : !isMyTurn ? `${t("status.turn")} ${state.players[state.currentTurnIndex]?.name ?? ""}` : ""}
          </span>
        ) : null}
      </div>

      {/* Hand — an overlapping fan that deals in, then lifts each card on hover.
          Cards overlap so a big hand still reads as one cohesive spread; the
          row scrolls horizontally only when even the overlap can't fit. */}
      {hand.length === 0 ? (
        <p className="py-6 text-center text-sm text-ash-light">{t("game.emptyHand")}</p>
      ) : (
        <motion.div
          className="flex justify-start overflow-x-auto overflow-y-hidden px-5 pb-1 pt-1 [perspective:900px] sm:justify-center"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.045 } } }}
        >
          {hand.map((card, i) => {
            const gang = isGangType(card.type);
            const playableNow =
              canPlay && (gang || (card.type !== "FREEZE" && CARD_SPECS[card.type].role !== "danger"));
            return (
              <motion.div
                key={card.id}
                className="relative shrink-0 transition-[z-index] hover:z-20 focus-within:z-20"
                style={{ marginLeft: i === 0 ? 0 : "-0.6rem", zIndex: 1 }}
                variants={
                  reduce
                    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                    : {
                        hidden: { opacity: 0, y: 26, rotateZ: -5 },
                        show: {
                          opacity: 1, y: 0, rotateZ: 0,
                          transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
                        },
                      }
                }
              >
                <Card
                  card={card}
                  name={cardName(card.type)}
                  description={cardDesc(card.type)}
                  size="sm"
                  selected={selected.includes(card.id)}
                  disabled={!playableNow}
                  onActivate={() => onCardClick(card.id, card.type)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
