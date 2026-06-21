# 🌋 Volcano Cats — Frontend

Game kartu multiplayer real-time bertema kucing & lava. 2–10 pemain, satu deck
bersama, dan satu pertanyaan tiap giliran: **berani tarik kartunya?** Tarik Lava
Cat (🌋) tanpa pegang Water Bucket (💧), dan kamu langsung tamat. Yang terakhir
bertahan, menang. 😼

Frontend dibangun dengan **Next.js 14** (App Router) + **Zustand** +
**colyseus.js**, dengan design system "obsidian/lava/gold" yang molten dan
high-contrast (lihat `DESIGN.md` dan `PRODUCT.md`).

## Fitur

- **Room lewat kode** — buat room, bagikan kode pendek ke teman, mereka gabung.
  Tanpa akun, tanpa matchmaking.
- **2–10 pemain** dalam satu room.
- **Real-time via Colyseus** — semua aksi ter-broadcast langsung; meja selalu
  sinkron untuk semua orang.
- **Reconnect via token** — refresh atau koneksi putus saat game jalan? Kamu
  otomatis tersambung kembali ke kursi yang sama (server memberi waktu reconnect
  60 detik) tanpa kehilangan state.
- **Mode Away / auto-play** — pemain yang AFK atau offline gilirannya dimainkan
  otomatis oleh server, jadi game tidak macet menunggu satu orang.
- **i18n-ready** — semua teks mengalir lewat tabel i18n (default Bahasa
  Indonesia), termasuk nama & deskripsi kartu. Locale lain tinggal di-drop in.
- **Aksesibilitas WCAG 2.1 AA** — kontras teks memenuhi AA, status tidak pernah
  mengandalkan warna/emoji saja (selalu dipasangkan teks), focus trap di dialog,
  `aria-live` untuk perubahan giliran/log/toast, dan operasi penuh via keyboard.
- **Responsive mobile → desktop** — dari layar ~320px sampai desktop; dialog jadi
  bottom sheet di mobile dan modal di tengah pada layar lebar; `safe-area-inset`
  dihormati.
- **Rules overlay in-app** — aturan lengkap + referensi semua kartu bisa dibuka
  kapan saja dari dalam game (komponen `RulesOverlay`).
- **`prefers-reduced-motion`** dihormati untuk setiap animasi (degradasi ke
  crossfade/instan).

## Cara Main / Aturan Lengkap

### Tujuan

Jadilah **pemain terakhir yang masih hidup**. Semua orang menarik kartu dari deck
yang sama; menarik **Lava Cat (🌋)** tanpa **Water Bucket (💧)** = tereliminasi.

### Setup

- Tiap pemain mulai dengan **6 kartu + 1 Water Bucket**.
- Deck berisi **(jumlah pemain − 1) Lava Cat**, terkubur acak — selalu ada satu
  pemain lebih banyak daripada bahaya.
- **Water Bucket ekstra** ditabur ke deck: **2** untuk ≤4 pemain, **3** untuk
  5–7 pemain, **4** untuk 8–10 pemain.
- Kalau deck tarik habis, tumpukan buangan (kecuali Lava Cat yang sudah meledak)
  dikocok ulang jadi deck baru.

### Alur Giliran

1. Saat giliranmu, kamu boleh **main kartu sebanyak yang kamu mau** (atau tidak
   sama sekali).
2. Untuk mengakhiri giliran, kamu **WAJIB menarik satu kartu** — kecuali sudah
   ada kartu yang menutup giliranmu (mis. Nap Time / Eruption).
3. Menarik **Lava Cat tanpa Water Bucket = eliminasi**. Kalau kamu pegang Water
   Bucket, dia dipakai otomatis, lalu kamu **diam-diam menaruh Lava Cat balik ke
   deck** di posisi mana pun.

### Window Freeze (Nope)

Begitu kartu aksi atau Gang dimainkan, aksinya menggantung di sebuah window
pendek (~4 detik). Siapa pun yang pegang **Freeze (❄️)** boleh membatalkannya —
dan Freeze itu sendiri bisa di-Freeze balik. **Jumlah Freeze genap** → aksi tetap
jalan; **ganjil** → aksi batal.

### Bunker

**Bunker (🛡️)** adalah perisai sekali pakai yang dipasang di depanmu. Dia
membatalkan **efek negatif pertama** yang menyasarmu (tarik paksa, curian, Bribe,
tukar tangan, Lockdown, tarikan Lava Cat), lalu hancur. Bunker **tidak menahan
Flood**, karena Flood kena semua orang sekaligus.

### Daftar Kartu (21 jenis)

#### Bahaya

| Kartu | Emoji | Efek |
|---|---|---|
| Lava Cat | 🌋 | Tarik tanpa Water Bucket → kamu MATI. Jumlahnya = (pemain − 1). |
| Water Bucket | 💧 | Selamatkan diri dari Lava Cat otomatis; taruh balik Lava Cat di posisi mana pun dalam deck. |

#### Aksi

| Kartu | Emoji | Target | Efek |
|---|---|---|---|
| Nap Time | 😴 | — | Akhiri giliran tanpa menarik kartu (Skip). |
| Eruption | 🌀 | — | Akhiri giliranmu; pemain berikutnya kena 2 giliran. Stacking — kalau dia Eruption balik, giliran menumpuk +2. |
| Spy Cat | 🔭 | — | Lihat 3 kartu teratas deck secara rahasia. |
| Earthquake | 🔀 | — | Acak ulang seluruh deck. |
| Freeze | ❄️ | — | Batalkan aksi apa pun selama window-nya; bisa di-Freeze balik. |
| Bribe | 🎁 | Pemain | Target memberimu 1 kartu pilihan **mereka** (Favor). |
| Reverse | 🔄 | — | Balik arah giliran. Saat tinggal 2 pemain, berfungsi juga sebagai Skip. |
| Sniper | 🎯 | Pemain | Target langsung menarik 1 kartu, di luar giliran. Giliranmu **tidak** berakhir. |
| Peek & Swap | 👁️ | — | Lihat 1 kartu teratas deck, lalu boleh tukar dengan 1 kartu dari tanganmu. |
| Bunker | 🛡️ | — | Pasang perisai sekali pakai (lihat bagian Bunker). |
| Pickpocket | 💸 | Pemain | Lihat tangan target dan **ambil 1 kartu pilihanmu** (curian dengan info penuh). |
| Flood | 🌊 | — | Setiap pemain membuang 1 kartu pilihan mereka. (Bunker tidak menahannya.) |
| Time Warp | 🪄 | — | Ambil 1 kartu apa pun dari tumpukan buangan ke tanganmu. |
| Lockdown | 🔒 | Pemain | Giliran berikutnya target hanya boleh menarik — tidak boleh main kartu. Hilang setelah giliran itu. |

#### Gang (5 elemen)

Kartu Gang: **Fire (🔥), Ice (🧊), Storm (⚡), Earth (🌿), Shadow (🌑)** —
dimainkan sebagai **set/combo**, bukan satuan:

| Combo | Syarat | Efek |
|---|---|---|
| Pasangan | 2 kartu elemen sama | Curi 1 kartu acak dari pemain pilihan. |
| Trio | 3 kartu elemen sama | Sebut 1 jenis kartu; ambil dari target kalau dia punya (kalau tidak, zonk). |
| Kuartet | 4 kartu elemen sama | Rampok 1 kartu acak dari **setiap** lawan (raid). |
| Rainbow | 5 elemen berbeda | Tukar **seluruh** tanganmu dengan tangan pemain pilihan. |

### Menang

Saat hanya tersisa **satu pemain hidup**, dia menang. 🏆🌋

## Tech Stack

- **Next.js 14** (App Router)
- **Zustand** `^4` — state UI lokal (seleksi tangan, targeting, overlay, toast)
- **colyseus.js** `^0.16` — WebSocket client ke game server
- **Tailwind CSS** `^3` — styling dengan design token kustom
- **Framer Motion** `^10` — orkestrasi animasi (dengan dukungan reduced-motion)
- **Vercel** — hosting

## Setup Local

```bash
npm install

# Mirror kontrak shared (cards/events/protocol) dari backend ke lib/shared.
# Jalankan ulang setiap kali kontrak di backend berubah.
node scripts/sync-shared.mjs

# Set URL backend (Colyseus server). Buat .env.local:
#   NEXT_PUBLIC_SERVER_URL=ws://localhost:3001
cp .env.local.example .env.local   # lalu edit isinya

npm run dev
```

Buka `http://localhost:3000`.

> ⚠️ **Penting**: backend (Colyseus server) harus jalan duluan (default
> `localhost:3001`) sebelum frontend bisa connect. Lihat repo
> `volcano-cats-be`.

## Struktur Folder

```
app/
├── page.tsx                  # Home — input username, buat/join room
├── room/[id]/page.tsx        # Halaman game (orchestrator)
├── layout.tsx                # Root layout + font
└── globals.css               # Token CSS, animasi, scrollbar

components/
├── ui/                       # Design-system primitives (presentational, no state)
│   ├── Button, Card, Modal, Sheet/ResponsiveDialog, Avatar,
│   ├── StatusBadge, Toast, ToastRegion, Spinner …
│   └── index.ts              # Barrel export
└── game/                     # Komponen game (membaca store/net)
    ├── RulesOverlay.tsx      # Overlay aturan in-app (referensi statis)
    ├── GameTable, PlayerHand, GameOver, Lobby, dialog kontekstual …
    └── …

lib/
├── shared/                   # Kontrak FE⇄BE (mirror dari backend — JANGAN edit manual)
│   ├── cards.ts              # Katalog kartu kanonik (CARD_SPECS, ALL_CARD_TYPES, GANG_TYPES)
│   ├── events.ts             # Tipe GameEvent
│   └── protocol.ts           # Command/message wire types + Phase
├── net/                      # Klien Colyseus (koneksi, kirim command, terima message)
├── i18n/                     # Tabel string (id.ts) + helper (cardName/cardDesc/t)
└── cardTheme.ts              # Visual per kartu (gradient/warna/glow/emoji)

store/                        # Zustand stores (game state mirror + UI state)
hooks/                        # React hooks (mis. koneksi room)
```

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import project di [vercel.com/new](https://vercel.com/new).
3. Set environment variable:
   - `NEXT_PUBLIC_SERVER_URL` = `wss://<your-railway-app>.up.railway.app`

   > ⚠️ Gunakan **`wss://`** (bukan `https://`) karena ini koneksi WebSocket, dan
   > pastikan backend Railway sudah deploy duluan.
4. Deploy!

## Catatan Implementasi

- **Server-authoritative 100%.** Frontend tidak punya game logic sendiri — semua
  validasi & aturan ada di engine backend. Frontend hanya mengirim "intent" lalu
  me-render state yang dikembalikan.
- **Anti-cheat by construction.** Isi tangan pemain lain tidak pernah dikirim ke
  client (hanya `handCount`), jadi tidak bisa diintip lewat devtools. Deck juga
  hanya dikirim sebagai jumlah, bukan isinya.
