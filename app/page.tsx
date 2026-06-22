"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, SoundToggle } from "@/components/ui";
import { CardArt } from "@/components/ui/CardArt";
import { EmberParticles } from "@/components/animations/EmberParticles";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { t } from "@/lib/i18n";

const NAME_KEY = "vc_username";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"home" | "join">("home");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) setName(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // Subtle pointer parallax on the background glow blobs (motion-on only).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.querySelector("[data-parallax]");
    if (!root) return;
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax-layer]"));
    const setters = layers.map((el) => ({
      x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" }),
      depth: Number(el.dataset.parallaxLayer ?? 1),
    }));
    const onMove = (e: PointerEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      setters.forEach((s) => {
        s.x(cx * s.depth * 8);
        s.y(cy * s.depth * 8);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  function remember(n: string) {
    try {
      localStorage.setItem(NAME_KEY, n);
    } catch {
      /* ignore */
    }
  }

  function create() {
    const n = name.trim();
    if (!n) return setError(t("lobby.enterName"));
    remember(n);
    router.push("/room/_new");
  }

  function join() {
    const n = name.trim();
    const c = code.trim();
    if (!n) return setError(t("lobby.enterName"));
    if (c.length !== 5) return setError(t("lobby.enterCode"));
    remember(n);
    router.push(`/room/${c}`);
  }

  const inputClass =
    "w-full rounded-xl border border-panel-line bg-panel-2 px-4 py-3 text-ink " +
    "placeholder:text-ink-soft/60 transition-all duration-200 focus:outline-none " +
    "focus:border-lava focus:shadow-[0_0_0_3px_rgba(214,58,11,0.18)]";

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-10">
      <EmberParticles count={18} />
      <div data-parallax className="pointer-events-none absolute inset-0 z-table">
        <div data-parallax-layer="3" className="absolute left-1/2 top-1/3 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-3xl" />
        <div data-parallax-layer="2" className="absolute right-[12%] top-[18%] h-[320px] w-[320px] rounded-full bg-lava/15 blur-3xl" />
        <div data-parallax-layer="4" className="absolute bottom-0 left-1/2 h-[300px] w-[760px] -translate-x-1/2 rounded-full bg-sky-3/40 blur-3xl" />
      </div>

      <div className="absolute right-3 top-3 z-banner">
        <SoundToggle />
      </div>

      <div className="relative z-banner flex w-full max-w-md flex-col items-center gap-8">
        <header className="select-none text-center">
          <div className="mb-2 flex animate-slide-up justify-center" aria-hidden="true">
            <div
              className="relative grid h-24 w-24 animate-float place-items-center rounded-full border border-panel-line bg-panel shadow-panel"
              style={{ color: "#F5481E" }}
            >
              <CardArt type="GANG_FIRE" className="h-16 w-16" />
              <span className="absolute -bottom-1 -right-1 text-2xl drop-shadow-[0_1px_2px_rgba(90,60,25,0.4)]">🌋</span>
            </div>
          </div>
          <h1 className="bg-lava-gradient bg-clip-text font-display text-5xl leading-[0.95] tracking-tight text-transparent [filter:drop-shadow(0_3px_4px_rgba(140,45,0,0.42))] sm:text-6xl">
            VOLCANO
          </h1>
          <h1 className="bg-gold-gradient bg-clip-text font-display text-5xl leading-[0.95] tracking-tight text-transparent [filter:drop-shadow(0_3px_4px_rgba(150,95,0,0.42))] sm:text-6xl">
            CATS
          </h1>
          <p className="mt-3 text-sm font-medium text-ink-soft">{t("app.tagline")}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            2–10 Pemain · Multiplayer
          </p>
        </header>

        <section className="w-full rounded-2xl border border-panel-line bg-panel p-6">
          <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {t("lobby.enterName")}
          </label>
          <input
            id="name"
            value={name}
            maxLength={20}
            placeholder="Nama panggilanmu…"
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && (mode === "join" ? join() : create())}
            className={`${inputClass} mb-4`}
          />

          {mode === "join" && (
            <>
              <label htmlFor="code" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
                {t("lobby.roomCode")}
              </label>
              <input
                id="code"
                value={code}
                maxLength={5}
                placeholder="Contoh: MEONG"
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""));
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && join()}
                className={`${inputClass} mb-4 text-center font-display text-xl tracking-[0.2em]`}
              />
            </>
          )}

          {error && (
            <p className="mb-3 text-center text-sm text-ember animate-slide-up" role="alert">
              ⚠️ {error}
            </p>
          )}

          <div className="flex flex-col gap-3">
            {mode === "home" ? (
              <>
                <Button variant="primary" size="lg" fullWidth onClick={create}>
                  🌋 {t("lobby.create")}
                </Button>
                <Button variant="outline" size="lg" fullWidth onClick={() => setMode("join")}>
                  🔗 {t("lobby.join")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="lg" fullWidth onClick={join}>
                  ✅ {t("lobby.join")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setMode("home");
                    setError("");
                  }}
                >
                  ← {t("action.back")}
                </Button>
              </>
            )}
          </div>
        </section>

        <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs font-medium text-ink-soft">
          <span>🌋 Jangan tarik Lava Cat</span>
          <span aria-hidden="true">·</span>
          <span>💧 Water Bucket = selamat</span>
          <span aria-hidden="true">·</span>
          <span>🏆 Terakhir bertahan menang</span>
        </p>
      </div>
    </main>
  );
}
