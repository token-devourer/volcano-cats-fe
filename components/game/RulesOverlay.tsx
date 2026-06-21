"use client";
// ============================================================
// RULES OVERLAY — in-app rulebook (static reference)
// ============================================================
// Static reference content for "Volcano Cats", built purely from the
// shared catalog (ALL_CARD_TYPES) + the i18n table. It reads NO game
// state and no network — it's the same for everyone, always. Opens and
// closes via the UI store's `showRules` / `setRules`.
//
// Layout: a scrollable ResponsiveDialog (centered modal on desktop,
// bottom sheet on mobile) with prose sections, a card-reference grid
// grouped by role (danger / action / gang), and a Gang-combos block
// (combos aren't per-card, so they're spelled out separately).
//
// Accessibility: body copy uses cream / ash-light (AA on dark surfaces,
// never the borderline `ash`); long prose gets `text-wrap: pretty`;
// reduced motion is handled by ResponsiveDialog itself.
// ============================================================

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { ResponsiveDialog } from "@/components/ui";
import { CardArt } from "@/components/ui/CardArt";
import { ALL_CARD_TYPES, CARD_SPECS, type CardType, type CardRole } from "@/lib/shared";
import { getCardTheme } from "@/lib/cardTheme";
import { cardName, cardDesc, t } from "@/lib/i18n";
import { useUI } from "@/store/ui";

/** `text-wrap: pretty` isn't a global utility — apply it inline on prose. */
const PRETTY: CSSProperties = { textWrap: "pretty" } as CSSProperties;

export default function RulesOverlay() {
  const showRules = useUI((s) => s.showRules);
  const setRules = useUI((s) => s.setRules);

  // Group card types by role once. Order follows ALL_CARD_TYPES (the
  // catalog's canonical ordering), so danger reads first, then actions,
  // then gang — exactly how the sections are laid out below.
  const byRole = useMemo(() => {
    const groups: Record<CardRole, CardType[]> = { danger: [], action: [], gang: [] };
    for (const type of ALL_CARD_TYPES) groups[CARD_SPECS[type].role].push(type);
    return groups;
  }, []);

  return (
    <ResponsiveDialog
      open={showRules}
      onClose={() => setRules(false)}
      title={t("rules.title")}
      icon="📖"
      accent="lava"
    >
      {/* Scroll region — capped height so the dialog never exceeds the
          viewport; the sheet/modal chrome stays fixed while this scrolls. */}
      <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
        <p className="text-cream leading-relaxed" style={PRETTY}>
          {t("rules.intro")}
        </p>

        <Section title={t("rules.objective.title")}>
          <Prose>{t("rules.objective.body")}</Prose>
        </Section>

        <Section title={t("rules.turn.title")}>
          <Prose>{t("rules.turn.body")}</Prose>
          <Prose>{t("rules.turn.draw")}</Prose>
        </Section>

        <Section title={t("rules.deck.title")}>
          <Prose>{t("rules.deck.body")}</Prose>
          <Prose>{t("rules.deck.reshuffle")}</Prose>
        </Section>

        <Section title={t("rules.freeze.title")}>
          <Prose>{t("rules.freeze.body")}</Prose>
          <Prose>{t("rules.freeze.counter")}</Prose>
        </Section>

        <Section title={t("rules.bunker.title")}>
          <Prose>{t("rules.bunker.body")}</Prose>
          <Prose>{t("rules.bunker.note")}</Prose>
        </Section>

        {/* Card reference — grouped by role, generated from the catalog. */}
        <Section title={t("rules.cards.title")}>
          <div className="space-y-5">
            <CardGroup label={t("rules.section.danger")} types={byRole.danger} />
            <CardGroup label={t("rules.section.action")} types={byRole.action} />
            <CardGroup label={t("rules.section.gang")} types={byRole.gang} />
          </div>
        </Section>

        {/* Gang combos — not per-card, so spelled out on their own. */}
        <Section title={t("rules.combos.title")}>
          <Prose>{t("rules.combos.intro")}</Prose>
          <ul className="mt-2 space-y-2">
            <Combo title={t("rules.combos.pair.title")} body={t("rules.combos.pair.body")} />
            <Combo title={t("rules.combos.triple.title")} body={t("rules.combos.triple.body")} />
            <Combo title={t("rules.combos.quad.title")} body={t("rules.combos.quad.body")} />
            <Combo title={t("rules.combos.rainbow.title")} body={t("rules.combos.rainbow.body")} />
          </ul>
        </Section>

        <Section title={t("rules.win.title")}>
          <Prose>{t("rules.win.body")}</Prose>
        </Section>
      </div>
    </ResponsiveDialog>
  );
}

// ------------------------------------------------------------
// Presentational helpers (local to this overlay)
// ------------------------------------------------------------

/** A titled section: display heading + body. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-display text-base tracking-tight text-lava">{title}</h3>
      {children}
    </section>
  );
}

/** A paragraph of running prose — AA-legible, pretty-wrapped, ≤ ~70ch. */
function Prose({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[70ch] text-sm leading-relaxed text-ash-light" style={PRETTY}>
      {children}
    </p>
  );
}

/** A labelled grid of card-reference rows for one role group. */
function CardGroup({ label, types }: { label: string; types: CardType[] }) {
  if (types.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-cream">{label}</h4>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {types.map((type) => (
          <CardRef key={type} type={type} />
        ))}
      </ul>
    </div>
  );
}

/**
 * One card's reference row: emoji chip (accent-tinted from the theme),
 * its localized name, and its localized short description. Emoji is
 * decorative here — the name carries the meaning (text + icon, never
 * icon-only).
 */
function CardRef({ type }: { type: CardType }) {
  const theme = getCardTheme(type);
  return (
    <li className="flex items-start gap-3 rounded-xl border border-card-border bg-obsidian-2 p-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg p-1.5"
        style={{ background: `${theme.color}1A`, boxShadow: `inset 0 0 0 1px ${theme.color}40`, color: theme.color }}
        aria-hidden="true"
      >
        <CardArt type={type} className="h-full w-full" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm leading-tight" style={{ color: theme.color }}>
          {cardName(type)}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-ash-light" style={PRETTY}>
          {cardDesc(type)}
        </p>
      </div>
    </li>
  );
}

/** A single Gang combo row: combo name + what it does. */
function Combo({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-xl border border-card-border bg-obsidian-2 p-3">
      <p className="font-display text-sm leading-tight text-gold">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-ash-light" style={PRETTY}>
        {body}
      </p>
    </li>
  );
}
