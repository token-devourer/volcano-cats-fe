/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================================
        // WARM WOODEN-TABLE PALETTE (cheerful "ceria" direction)
        // ============================================================
        // Surfaces: warm wood table + cream printed cards/panels.
        //   • wood tones  — the table surface (dark brown = readable
        //     backdrop for cream/gold display text).
        //   • cream tones — panels, cards, modals (carry dark INK text).
        // All accent values are tuned so dark INK reads on cream AND
        // light CREAM reads on the accent (WCAG AA). See DESIGN.md.
        // ------------------------------------------------------------

        // --- Warm wood surfaces (the table) ---
        wood:         "#8A5A2E", // table base plank
        "wood-deep":  "#5E3A1C", // vignette / grain shadow / dark plaque
        "wood-glow":  "#A9712F", // warm light pool at table center

        // --- Cream panels / cards ---
        panel:        "#FFF6E9", // cream panel/surface (primary)
        "panel-2":    "#FBEAD2", // raised/inset cream (inputs, hovers)
        "panel-line": "#E3C7A0", // soft brown hairline border (1px)

        // --- Ink (dark text on cream/wood-light) ---
        ink:          "#2A1A10", // primary text on cream (~15:1 AA)
        "ink-soft":   "#7A5A40", // muted/secondary on cream (~6:1 AA)

        // --- Light text (on wood / dark accents only) ---
        cream:        "#FFF7EC",

        // --- Heat accents (AA-tuned: cream-on-accent ≥ 4.5:1) ---
        lava:         "#D63A0B", // primary action / draw / heat
        "lava-dim":   "#B02E08", // button gradient end + pressed
        gold:         "#E6A317", // reward / room-code plaque text
        "gold-dim":   "#B07A0E",
        ember:        "#D0332A", // danger / elimination

        // --- Gang / elemental (card-art + solid badges; AA as solid bg) ---
        "gang-fire":   "#D63A0B",
        "gang-ice":    "#2BB7C4", // decorative (teal) — borders/bars only
        "gang-storm":  "#7A3FC4", // deep grape — cream-on-it AA
        "gang-earth":  "#2E8B3A", // forest — cream-on-it AA
        "gang-shadow": "#7A5BE0", // grape (decorative card art)

        // --- Legacy aliases (re-pointed warm) for any unmigrated usage ---
        obsidian:      "#8A5A2E", // → wood
        "obsidian-2":  "#FBEAD2", // → panel-2
        "obsidian-3":  "#FFF6E9", // → panel
        ash:           "#7A5A40", // → ink-soft
        "ash-light":   "#7A5A40", // → ink-soft
        "card-bg":     "#FBEAD2",
        "card-border": "#E3C7A0",
      },
      fontFamily: {
        display: ["Righteous", "sans-serif"],
        body:    ["Hanken Grotesk", "sans-serif"],
      },
      // Semantic z-index scale — replaces ad-hoc 30/40/50/60 across the app.
      // table (ambient/ember layer) sits behind everything; tooltip wins.
      zIndex: {
        table:            "0",
        hand:             "10",
        toast:            "20",
        banner:           "30",
        "modal-backdrop": "40",
        modal:            "50",
        tooltip:          "60",
      },
      boxShadow: {
        // Warm shadows (brown-tinted, not pure black) for cream cards on wood.
        "lava-glow":   "0 0 20px rgba(214, 58, 11, 0.55), 0 0 60px rgba(214, 58, 11, 0.22)",
        "gold-glow":   "0 0 20px rgba(230, 163, 23, 0.5)",
        "card-hover":  "0 12px 30px rgba(60, 30, 10, 0.34), 0 2px 8px rgba(214, 58, 11, 0.15)",
        "card-normal": "0 6px 16px rgba(60, 30, 10, 0.22)",
        "panel":       "0 10px 32px rgba(60, 30, 10, 0.22)",
      },
      backgroundImage: {
        "lava-gradient": "linear-gradient(135deg, #E8470A 0%, #B02E08 100%)",
        "gold-gradient": "linear-gradient(135deg, #F4BE2E 0%, #D4900E 100%)",
        // The table: a warm pool of light on a wood plank surface.
        "table-felt":    "radial-gradient(ellipse at 50% 38%, #A9712F 0%, #8A5A2E 42%, #5E3A1C 100%)",
        "table-wood":    "radial-gradient(ellipse at 50% 38%, #A9712F 0%, #8A5A2E 42%, #5E3A1C 100%)",
      },
      animation: {
        "card-flip":    "cardFlip 0.4s ease-in-out",
        "card-deal":    "cardDeal 0.3s ease-out",
        "lava-pulse":   "lavaPulse 1.5s ease-in-out infinite",
        "shake":        "shake 0.5s ease-in-out",
        "float-up":     "floatUp 0.6s ease-out forwards",
        "ember-fall":   "emberFall 2s ease-in infinite",
        "glow-pulse":   "glowPulse 2s ease-in-out infinite",
        "slide-up":     "slideUp 0.3s ease-out",
        // ease-out-quint — smooth deceleration, no overshoot/bounce (per DESIGN.md motion rules)
        "bounce-in":    "bounceIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "death-flash":  "deathFlash 0.8s ease-out",
      },
      keyframes: {
        cardFlip: {
          "0%":   { transform: "rotateY(0deg)" },
          "50%":  { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        cardDeal: {
          "0%":   { transform: "translateY(-40px) scale(0.8)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)",       opacity: "1" },
        },
        lavaPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(214,58,11,0.4)" },
          "50%":      { boxShadow: "0 0 40px rgba(214,58,11,0.9), 0 0 80px rgba(214,58,11,0.3)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%":  { transform: "translateX(-8px) rotate(-1deg)" },
          "20%":  { transform: "translateX(8px)  rotate(1deg)" },
          "30%":  { transform: "translateX(-6px)" },
          "40%":  { transform: "translateX(6px)" },
          "50%":  { transform: "translateX(-4px)" },
          "60%":  { transform: "translateX(4px)" },
          "70%":  { transform: "translateX(-2px)" },
          "80%":  { transform: "translateX(2px)" },
        },
        floatUp: {
          "0%":   { transform: "translateY(0)",    opacity: "1" },
          "100%": { transform: "translateY(-80px)", opacity: "0" },
        },
        emberFall: {
          "0%":   { transform: "translateY(-10px) translateX(0)",    opacity: "1" },
          "100%": { transform: "translateY(100vh) translateX(20px)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        bounceIn: {
          "0%":   { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        deathFlash: {
          "0%":   { backgroundColor: "transparent" },
          "20%":  { backgroundColor: "rgba(208,51,42,0.6)" },
          "100%": { backgroundColor: "transparent" },
        },
        cardPlayPop: {
          "0%":   { transform: "scale(0.3) translateY(40px)", opacity: "0" },
          "15%":  { transform: "scale(1.1) translateY(0)",    opacity: "1" },
          "25%":  { transform: "scale(1) translateY(0)",      opacity: "1" },
          "80%":  { transform: "scale(1) translateY(0)",      opacity: "1" },
          "100%": { transform: "scale(0.85) translateY(-30px)", opacity: "0" },
        },
        fadeOut: {
          "0%":   { opacity: "0" },
          "15%":  { opacity: "1" },
          "75%":  { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
