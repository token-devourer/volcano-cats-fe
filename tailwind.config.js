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
        // MOLTEN CALDERA PALETTE — dark obsidian table, lava accents.
        // Page/table surfaces are deep volcanic black with an ember
        // underglow at the center. Panels are warm dark stone so cream
        // ink reads clearly. Cards stay as cream printed sticker objects
        // on top — their bodies use --card-face and --print-ink so the
        // global ink flip does not affect printed card text.
        // ------------------------------------------------------------

        // --- Dark surfaces (page / table backdrop) ---
        "sky-1": "#2b0c0a", // smoldering rock (gradient top)
        "sky-2": "#1a0608", // night basalt (gradient mid / page base)
        "sky-3": "#0a0304", // deep void (gradient bottom)
        sun:     "#ff8a3d", // hot lava pool (used in radial center)

        // --- Warm dark surfaces (legacy "wood" names, re-pointed) ---
        wood:         "#1a0608", // dark basalt table
        "wood-deep":  "#0a0304", // void shadow
        "wood-glow":  "#4a1207", // deep ember pool light

        // --- Stone panels / cards (dark) ---
        panel:        "#1f0e10", // warm dark stone (primary surface)
        "panel-2":    "#2b1417", // raised/inset stone (inputs/hovers)
        "panel-line": "#4a1d18", // ember-tinted hairline border

        // --- Ink (light text on dark stone) ---
        ink:          "#f5e5d4", // primary text (warm cream on stone)
        "ink-soft":   "#b89a87", // muted/secondary

        // --- Light text (on solid accents) ---
        cream:        "#FFF7EC",

        // --- Heat / reward accents (molten) ---
        lava:         "#ff5722", // primary action / draw / heat
        "lava-dim":   "#c03108", // pressed/gradient end
        magma:        "#ff2e6e", // hot magenta — loudest moments
        gold:         "#ffc02e", // sulfur reward
        "gold-dim":   "#a07300", // gold ink on dark
        ember:        "#ff8a3d", // bright ember for glows / danger

        // --- Gang / elemental ---
        "gang-fire":   "#ff6a2b",
        "gang-ice":    "#5fd6ec",
        "gang-storm":  "#8a78ff",
        "gang-earth":  "#43d68a",
        "gang-shadow": "#c084fc",

        // --- Legacy aliases (re-pointed) ---
        obsidian:      "#0a0304",
        "obsidian-2":  "#1a0608",
        "obsidian-3":  "#1f0e10",
        ash:           "#b89a87",
        "ash-light":   "#d8c4b3",
        "card-bg":     "#FFF8EC",
        "card-border": "#3a1a14",
      },
      fontFamily: {
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
        "lava-gradient":  "linear-gradient(135deg, #ff8a3d 0%, #c03108 100%)",
        "magma-gradient": "linear-gradient(135deg, #ff2e6e 0%, #ff5722 100%)",
        "gold-gradient":  "linear-gradient(135deg, #ffd24d 0%, #c08400 100%)",
        // Caldera sky: ember-glow top fading to obsidian void.
        "table-sky":     "linear-gradient(180deg, #2b0c0a 0%, #1a0608 46%, #0a0304 100%)",
        // Caldera table: a hot lava pool at center bleeding into dark basalt.
        "table-felt":    "radial-gradient(ellipse at 50% 36%, #ff8a3d 0%, #c03108 18%, #4a1207 42%, #1a0608 70%, #0a0304 100%)",
        "table-wood":    "radial-gradient(ellipse at 50% 36%, #ff8a3d 0%, #c03108 18%, #4a1207 42%, #1a0608 70%, #0a0304 100%)",

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
