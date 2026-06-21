"use client";
import { useGame } from "@/store/game";
import { useUI } from "@/store/ui";
import { FreezeBanner } from "./FreezeBanner";
import {
  BucketModal,
  FavorModal,
  PeekSwapModal,
  FloodModal,
  TimeWarpModal,
  PickpocketModal,
  SpyModal,
  TargetPicker,
  DeclareTypeModal,
} from "./Modals";

/**
 * Single source of truth for "what should the player be doing right now":
 * maps the server phase (plus local targeting/declare intent and private
 * reveals) to exactly one prompt. Replaces the old pile of showXModal flags.
 */
export function PhaseController() {
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  const targeting = useUI((s) => s.targeting);
  const declare = useUI((s) => s.declarePicker);
  if (!state) return null;

  const phase = state.phase;
  const me = state.players.find((p) => p.id === myId);
  const nameOf = (id: string) => state.players.find((p) => p.id === id)?.name ?? "Pemain";

  return (
    <>
      <FreezeBanner />
      <SpyModal />
      {targeting && <TargetPicker />}
      {declare && <DeclareTypeModal />}

      {phase.kind === "await_bucket" && phase.playerId === myId && <BucketModal />}
      {phase.kind === "await_favor" && phase.fromId === myId && <FavorModal initiatorName={nameOf(phase.toId)} />}
      {phase.kind === "await_peek_swap" && phase.playerId === myId && <PeekSwapModal />}
      {phase.kind === "await_flood" && me?.alive && <FloodModal />}
      {phase.kind === "await_timewarp" && phase.playerId === myId && <TimeWarpModal />}
      {phase.kind === "await_pickpocket" && phase.playerId === myId && <PickpocketModal />}
    </>
  );
}
