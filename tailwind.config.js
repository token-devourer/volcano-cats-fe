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
        // TROPIC POP PALETTE (bright "candy/sticker" direction)
        // ============================================================
        // A tropical-island volcano table: a fresh aqua → seafoam → warm
        // sand surface, bright sticker cards/panels carrying dark INK text,
        // hot coral-lava energy with a magenta MAGMA reserved for the
        // loudest moments, sunshine gold reward, and candy elemental hues.
        // No dark surfaces — the page should feel happy and alive. INK
        // reads on cream AND on the bright surfaces; CREAM is reserved for
        // text sitting ON solid accents (buttons/badges). See DESIGN.md.
        // (This supersedes the earlier Sunny Daylight peach direction.)
        // ------------------------------------------------------------

        // --- Bright surfaces (the sky / page / table) ---
        "sky-1": "#86E5E0", // tropic aqua (gradient top)
        "sky-2": "#C7F0D8", // seafoam (gradient mid)
        "sky-3": "#FFE6B0", // warm sand (gradient bottom / table)
        sun:     "#FFF7E2", // warm light pool at table center

        // --- Warm surfaces (legacy "wood" names, re-pointed to SAND) ---
        wood:         "#FFE6B0", // sand mid-surface
        "wood-deep":  "#F7D38C", // deeper sand (NOT brown) — scrims/plaques
        "wood-glow":  "#FFF7E2", // warm light pool at table center

        // --- Sticker panels / cards ---
        panel:        "#FFFCF6", // warm near-white panel/surface (primary)
        "panel-2":    "#FFF3DF", // raised/inset cream (inputs, hovers)
        "panel-line": "#EFD9B2", // soft sandy hairline border (1px)

        // --- Ink (dark text on cream / bright surfaces) ---
        ink:          "#2A1C14", // primary text (~14:1 AA on cream)
        "ink-soft":   "#5C4632", // muted/secondary (~8:1 on cream, ~6:1 on sky)

        // --- Light text (on solid accents only) ---
        cream:        "#FFF7EC",

        // --- Heat / reward accents ---
        lava:         "#F5481E", // primary action / draw / heat
        "lava-dim":   "#D8390F", // button gradient end + pressed
        magma:        "#FF3D8B", // magenta-hot — loudest moments (decorative/effect; ink text if chipped)
        gold:         "#FFC02E", // reward (solid bg w/ ink text)
        "gold-dim":   "#946400", // gold TEXT on cream (~4.8:1 AA)
        ember:        "#EE3B34", // danger / elimination

        // --- Gang / elemental (candy; card-art + solid badges) ---
        "gang-fire":   "#FF6A2B", // bright coral-orange
        "gang-ice":    "#22C7E0", // bright cyan (cold/freeze accent)
        "gang-storm":  "#6D5CFF", // electric indigo (warp accent)
        "gang-earth":  "#2FCB7E", // tropical green (success)
        "gang-shadow": "#B06BE6", // plum (decorative card art)

        // --- Legacy aliases (re-pointed) for any unmigrated usage ---
        obsidian:      "#FFE6B0", // → sand
        "obsidian-2":  "#FFF3DF", // → panel-2
        "obsidian-3":  "#FFFCF6", // → panel
        ash:           "#5C4632", // → ink-soft
        "ash-light":   "#5C4632", // → ink-soft
        "card-bg":     "#FFF3DF",
        "card-border": "#EFD9B2",
      },
      fontFamily: {
        // Display = Fredoka (rounded, friendly, sticker-y) for logo/headings/card names.
        display: ["Fredoka", "Righteous", "sans-serif"],
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
        // Warm shadows (amber-tinted, not pure black) for sticker cards on the sand table.
        "lava-glow":   "0 0 20px rgba(245, 72, 30, 0.50), 0 0 60px rgba(245, 72, 30, 0.20)",
        "gold-glow":   "0 0 20px rgba(255, 192, 46, 0.55)",
        "magma-glow":  "0 0 22px rgba(255, 61, 139, 0.55), 0 0 64px rgba(255, 61, 139, 0.22)",
        "card-hover":  "0 14px 34px rgba(90, 60, 25, 0.30), 0 2px 8px rgba(245, 72, 30, 0.15)",
        "card-normal": "0 8px 18px rgba(90, 60, 25, 0.20)",
        "panel":       "0 12px 34px rgba(90, 60, 25, 0.20)",
      },
      backgroundImage: {
        // AA-safe ends so cream button text stays legible across the gradient.
        "lava-gradient":  "linear-gradient(135deg, #FF6A2B 0%, #E23A12 100%)",
        "magma-gradient": "linear-gradient(135deg, #FF5BA8 0%, #F5481E 100%)",
        "gold-gradient":  "linear-gradient(135deg, #FFD24D 0%, #F2A100 100%)",
        // The tropic sky / table: aqua → seafoam → warm sand.
        "table-sky":     "linear-gradient(180deg, #86E5E0 0%, #C7F0D8 46%, #FFE6B0 100%)",
        // Table = a warm sand stage pooled at center, surrounded by seafoam + aqua.
        "table-felt":    "radial-gradient(ellipse at 50% 36%, #FFF7E2 0%, #FFE6B0 34%, #C7F0D8 66%, #86E5E0 100%)",
        "table-wood":    "radial-gradient(ellipse at 50% 36%, #FFF7E2 0%, #FFE6B0 34%, #C7F0D8 66%, #86E5E0 100%)",
      },
      animation: {
        "card-flip":    "cardFlip 0.4s ease-in-out",
        "card-deal":    "cardDeal 0.3s ease-out",
        "lava-pulse":   "lavaPulse 1.5s ease-in-out infinite",
        "shake":        "shake 0.5s ease-in-out",
        "float-up":     "floatUp 0.6s ease-out forwards",
        "ember-fall":   "emberFall 2s ease-in infinite",
        "sparkle-float": "sparkleFloat 9s ease-in-out infinite",
        "glow-pulse":   "glowPulse 2s ease-in-out infinite",
        "slide-up":     "slideUp 0.3s ease-out",
        "float":        "floaty 4s ease-in-out infinite",
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
        // Sunny motes: gently rise and twinkle, then fade — happy, not falling.
        sparkleFloat: {
          "0%":        { transform: "translateY(12vh) scale(0.5)",  opacity: "0" },
          "15%":       { opacity: "0.85" },
          "55%":       { transform: "translateY(-4vh) scale(1)",    opacity: "0.7" },
          "85%":       { opacity: "0.5" },
          "100%":      { transform: "translateY(-20vh) scale(0.45)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "1" },
        },
        slideUp: {
          "0%":   { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
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
