"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { EmberParticles } from "@/components/animations/EmberParticles";
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
      <div className="pointer-events-none absolute inset-0 z-table">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lava/[0.10] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[280px] w-[720px] -translate-x-1/2 bg-ember/[0.10] blur-3xl" />
      </div>

      <div className="relative z-banner flex w-full max-w-md flex-col items-center gap-8">
        <header className="select-none text-center">
          <div className="mb-1 text-7xl animate-slide-up" aria-hidden="true">🌋</div>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-cream drop-shadow-[0_2px_10px_rgba(214,58,11,0.45)] sm:text-6xl">
            VOLCANO
          </h1>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-cream drop-shadow-[0_2px_12px_rgba(230,163,23,0.55)] sm:text-6xl">
            CATS
          </h1>
          <p className="mt-3 text-sm text-cream/90">{t("app.tagline")}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/70">
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

        <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs text-cream/70">
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
