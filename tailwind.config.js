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
        // SUNNY DAYLIGHT PALETTE (bright "ceria++" direction)
        // ============================================================
        // A sunlit table: peach→butter→sky background, bright cream
        // printed cards/panels carrying dark INK text, vivid lava/gold
        // energy and brightened elemental hues. No dark surfaces — the
        // page should feel happy and bright to play. INK reads on cream
        // AND on the sunny surfaces; CREAM is reserved for text sitting
        // ON solid accents (buttons/badges). See DESIGN.md.
        // ------------------------------------------------------------

        // --- Sunny surfaces (the sky / page / table) ---
        "sky-1": "#FFE8C5", // peach (gradient top)
        "sky-2": "#FFD89B", // butter (gradient mid)
        "sky-3": "#BFE3FF", // soft sky (gradient bottom)
        sun:     "#FFF3D6", // warm light pool at table center

        // --- Warm surfaces (legacy "wood" names, re-pointed BRIGHT) ---
        wood:         "#FFD89B", // butter mid-surface
        "wood-deep":  "#F2C879", // deeper sun (NOT brown) — scrims/plaques
        "wood-glow":  "#FFF3D6", // warm light pool at table center

        // --- Cream panels / cards ---
        panel:        "#FFFDF7", // bright cream panel/surface (primary)
        "panel-2":    "#FFF4DD", // raised/inset cream (inputs, hovers)
        "panel-line": "#F0D9AE", // soft sandy hairline border (1px)

        // --- Ink (dark text on cream / sunny surfaces) ---
        ink:          "#2A1A10", // primary text (~15:1 AA on cream)
        "ink-soft":   "#5A4226", // muted/secondary (~7:1 on cream, ~6:1 on sunny)

        // --- Light text (on solid accents only) ---
        cream:        "#FFF7EC",

        // --- Heat / reward accents (brightened) ---
        lava:         "#F2510E", // primary action / draw / heat
        "lava-dim":   "#D8430A", // button gradient end + pressed
        gold:         "#FFB31E", // reward (solid bg w/ ink text)
        "gold-dim":   "#9A6B00", // gold TEXT on cream (~4.7:1 AA)
        ember:        "#E5392B", // danger / elimination

        // --- Gang / elemental (brightened; card-art + solid badges) ---
        "gang-fire":   "#F2510E",
        "gang-ice":    "#36C5E0", // bright sky/cyan (cold/freeze accent)
        "gang-storm":  "#9B6BFF", // bright grape (warp accent)
        "gang-earth":  "#36D399", // bright mint (success)
        "gang-shadow": "#B08CFF", // light grape (decorative card art)

        // --- Legacy aliases (re-pointed bright) for any unmigrated usage ---
        obsidian:      "#FFD89B", // → wood
        "obsidian-2":  "#FFF4DD", // → panel-2
        "obsidian-3":  "#FFFDF7", // → panel
        ash:           "#5A4226", // → ink-soft
        "ash-light":   "#5A4226", // → ink-soft
        "card-bg":     "#FFF4DD",
        "card-border": "#F0D9AE",
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
        // Warm shadows (amber-tinted, not pure black) for cream cards on the sunny table.
        "lava-glow":   "0 0 20px rgba(242, 81, 14, 0.50), 0 0 60px rgba(242, 81, 14, 0.20)",
        "gold-glow":   "0 0 20px rgba(255, 179, 30, 0.55)",
        "card-hover":  "0 12px 30px rgba(120, 70, 20, 0.28), 0 2px 8px rgba(242, 81, 14, 0.15)",
        "card-normal": "0 6px 16px rgba(120, 70, 20, 0.18)",
        "panel":       "0 10px 32px rgba(120, 70, 20, 0.18)",
      },
      backgroundImage: {
        // AA-safe ends so cream button text stays legible across the gradient.
        "lava-gradient": "linear-gradient(135deg, #FF6A1E 0%, #D8430A 100%)",
        "gold-gradient": "linear-gradient(135deg, #FFC23D 0%, #F0A500 100%)",
        // The sunny sky / table: peach → butter → soft blue.
        "table-sky":     "linear-gradient(180deg, #FFE8C5 0%, #FFD89B 45%, #BFE3FF 100%)",
        // Legacy table names re-pointed to the sunny gradient (with a warm pool centre).
        "table-felt":    "radial-gradient(ellipse at 50% 32%, #FFF3D6 0%, #FFE3B0 38%, #FFD89B 64%, #BFE3FF 100%)",
        "table-wood":    "radial-gradient(ellipse at 50% 32%, #FFF3D6 0%, #FFE3B0 38%, #FFD89B 64%, #BFE3FF 100%)",
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
