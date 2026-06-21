// ============================================================
// VOLCANO CATS — i18n STRING TABLE (Indonesian, default locale)
// ============================================================
// Warm, casual Indonesian per PRODUCT.md voice (molten, mischievous,
// momentous). All user-facing copy flows through here — components must
// not hardcode strings. Card copy is keyed by the catalog `i18nKey`
// (e.g. card.lavaCat.name); event copy is generated from structured
// GameEvents so no display text ever crosses the wire.
// ============================================================

import type { GameEvent, ErrorCode } from "@/lib/shared";

/** Flat key → string table. Nested via dotted keys for readability. */
export type StringTable = Record<string, string>;

// ------------------------------------------------------------
// (a) CARD COPY — name / desc / flavor, keyed by catalog i18nKey.
//     Names + descriptions carried over from the legacy theme;
//     flavor lines written fresh in the brand voice.
// ------------------------------------------------------------
const CARDS: StringTable = {
  // --- DANGER ---
  "card.lavaCat.name": "Lava Cat",
  "card.lavaCat.desc": "Kalau kamu draw ini tanpa Water Bucket, kamu MATI!",
  "card.lavaCat.flavor": "Lucu sih... sampai meledak. 😼🌋",

  "card.waterBucket.name": "Water Bucket",
  "card.waterBucket.desc": "Selamatkan diri dari Lava Cat. Taruh balik Lava Cat di posisi mana pun dalam deck.",
  "card.waterBucket.flavor": "Satu siraman, nyawa selamat.",

  // --- CLASSIC ACTIONS ---
  "card.napTime.name": "Nap Time",
  "card.napTime.desc": "Skip giliran tanpa draw kartu.",
  "card.napTime.flavor": "Tidur dulu, urusan belakangan. 😴",

  "card.eruption.name": "Eruption",
  "card.eruption.desc": "Skip giliranmu. Pemain berikutnya kena 2 turn berturut-turut.",
  "card.eruption.flavor": "Bukan masalahmu lagi, sekarang masalah dia.",

  "card.spyCat.name": "Spy Cat",
  "card.spyCat.desc": "Lihat 3 kartu teratas deck secara rahasia.",
  "card.spyCat.flavor": "Ngintip dikit, menang banyak. 🔭",

  "card.earthquake.name": "Earthquake",
  "card.earthquake.desc": "Acak ulang seluruh deck.",
  "card.earthquake.flavor": "Kocok semuanya, biar deg-degan lagi.",

  "card.freeze.name": "Freeze",
  "card.freeze.desc": "Batalkan aksi siapa pun selama window berlangsung. Bisa di-Freeze balik!",
  "card.freeze.flavor": "Eits, nggak jadi ya. ❄️",

  "card.bribe.name": "Bribe",
  "card.bribe.desc": "Paksa 1 pemain kasih 1 kartu ke kamu. Mereka yang pilih kartunya.",
  "card.bribe.flavor": "Ayo dong, satu aja~ 🎁",

  // --- NEW MECHANICS ---
  "card.reverse.name": "Reverse",
  "card.reverse.desc": "Balik arah urutan giliran.",
  "card.reverse.flavor": "Putar balik, semua kaget.",

  "card.sniper.name": "Sniper",
  "card.sniper.desc": "Pilih 1 pemain — mereka harus draw 1 kartu sekarang, di luar giliran mereka.",
  "card.sniper.flavor": "Bidik, tembak, draw paksa. 🎯",

  "card.peekAndSwap.name": "Peek & Swap",
  "card.peekAndSwap.desc": "Lihat 1 kartu teratas deck, lalu boleh swap dengan 1 kartu dari tanganmu.",
  "card.peekAndSwap.flavor": "Intip dulu, tukar kalau perlu. 👁️",

  "card.bunker.name": "Bunker",
  "card.bunker.desc": "Pasang di depanmu. Batalkan efek negatif pertama yang kamu terima, lalu Bunker hancur.",
  "card.bunker.flavor": "Sembunyi aman di balik beton. 🛡️",

  "card.pickpocket.name": "Pickpocket",
  "card.pickpocket.desc": "Lihat tangan pemain pilihanmu, lalu ambil 1 kartu yang kamu mau.",
  "card.pickpocket.flavor": "Tangannya cepat, dompetnya lenyap. 💸",

  "card.flood.name": "Flood",
  "card.flood.desc": "Semua pemain buang 1 kartu pilihan mereka ke discard pile.",
  "card.flood.flavor": "Air bah datang, semua kebanjiran. 🌊",

  "card.timeWarp.name": "Time Warp",
  "card.timeWarp.desc": "Ambil 1 kartu apa pun dari discard pile ke tanganmu.",
  "card.timeWarp.flavor": "Putar waktu, ambil yang udah dibuang. 🪄",

  "card.lockdown.name": "Lockdown",
  "card.lockdown.desc": "Pilih 1 pemain — giliran berikutnya mereka tidak bisa main kartu apa pun.",
  "card.lockdown.flavor": "Digembok, nggak bisa ngapa-ngapain. 🔒",

  // --- GANG (cat) CARDS ---
  "card.gangFire.name": "Fire Gang",
  "card.gangFire.desc": "Kartu Gang. Kombinasikan dengan kartu sejenis untuk efek mencuri.",
  "card.gangFire.flavor": "Geng api, panas dan nekat. 🔥",

  "card.gangIce.name": "Ice Gang",
  "card.gangIce.desc": "Kartu Gang. Kombinasikan dengan kartu sejenis untuk efek mencuri.",
  "card.gangIce.flavor": "Geng es, dingin tapi mematikan. 🧊",

  "card.gangStorm.name": "Storm Gang",
  "card.gangStorm.desc": "Kartu Gang. Kombinasikan dengan kartu sejenis untuk efek mencuri.",
  "card.gangStorm.flavor": "Geng badai, datang tanpa aba-aba. ⚡",

  "card.gangEarth.name": "Earth Gang",
  "card.gangEarth.desc": "Kartu Gang. Kombinasikan dengan kartu sejenis untuk efek mencuri.",
  "card.gangEarth.flavor": "Geng bumi, kokoh dan keras kepala. 🌿",

  "card.gangShadow.name": "Shadow Gang",
  "card.gangShadow.desc": "Kartu Gang. Kombinasikan dengan kartu sejenis untuk efek mencuri.",
  "card.gangShadow.flavor": "Geng bayangan, nggak keliatan tapi ada. 🌑",
};

// ------------------------------------------------------------
// (b) UI STRINGS — buttons, lobby, connection, game-over, errors.
// ------------------------------------------------------------
const UI: StringTable = {
  // App / brand
  "app.title": "Volcano Cats",
  "app.tagline": "Tarik kartunya... kalau berani. 😼",

  // Generic actions
  "action.play": "Main",
  "action.draw": "Tarik Kartu",
  "action.cancel": "Batal",
  "action.confirm": "Oke",
  "action.close": "Tutup",
  "action.back": "Kembali",
  "action.copy": "Salin",
  "action.copied": "Tersalin!",
  "action.skip": "Lewati",
  "action.freeze": "Freeze!",
  "action.rematch": "Main Lagi",
  "action.leave": "Keluar",

  // Lobby / room
  "lobby.title": "Lobby",
  "lobby.roomCode": "Kode Room",
  "lobby.shareHint": "Bagikan kode ini ke temanmu biar bisa gabung.",
  "lobby.players": "Pemain",
  "lobby.waiting": "Menunggu pemain lain...",
  "lobby.start": "Mulai Game",
  "lobby.needMorePlayers": "Butuh minimal 2 pemain untuk mulai.",
  "lobby.hostOnly": "Hanya host yang bisa memulai game.",
  "lobby.enterName": "Masukkan namamu",
  "lobby.enterCode": "Masukkan kode room",
  "lobby.create": "Buat Room",
  "lobby.join": "Gabung Room",

  // Shared-link invite gate (arriving via a room URL with no saved name)
  "invite.title": "Kamu diundang!",
  "invite.subtitle": "Masukkan nama buat gabung ke room",
  "invite.cta": "Gabung Sekarang",

  // Player status (paired with StatusBadge)
  "status.host": "Host",
  "status.you": "Kamu",
  "status.away": "AFK",
  "status.locked": "Terkunci",
  "status.bunker": "Bunker",
  "status.dead": "Mati",
  "status.offline": "Terputus",
  "status.turn": "Giliran",

  // Connection states
  "conn.connecting": "Menyambungkan...",
  "conn.reconnecting": "Menyambung ulang...",
  "conn.connected": "Tersambung",
  "conn.disconnected": "Koneksi terputus",
  "conn.lost": "Koneksi ke server hilang. Coba sambung ulang.",

  // Game flow
  "game.yourTurn": "Giliranmu!",
  "game.deck": "Deck",
  "game.deckCount": "{count} kartu",
  "game.discard": "Buangan",
  "game.emptyHand": "Tanganmu kosong.",
  "game.pickTarget": "Pilih targetnya",
  "game.pickCard": "Pilih kartu",
  "game.freezeWindow": "Window Freeze — buruan kalau mau batalin!",
  "game.placeBucket": "Taruh Lava Cat balik ke deck",
  "game.loading": "Memuat...",

  // Game over
  "over.title": "Game Selesai",
  "over.winner": "{name} menang! 🏆",
  "over.youWin": "Kamu menang! 🏆🌋",
  "over.youLose": "Kamu kalah... tapi seru kan? 😹",
  "over.noWinner": "Tidak ada pemenang.",

  // Errors (keyed by ErrorCode)
  "error.GAME_NOT_STARTED": "Game belum dimulai.",
  "error.ALREADY_STARTED": "Game sudah berjalan.",
  "error.NOT_HOST": "Hanya host yang bisa melakukan ini.",
  "error.NOT_ENOUGH_PLAYERS": "Pemain belum cukup untuk mulai.",
  "error.ROOM_FULL": "Room sudah penuh.",
  "error.DUPLICATE_USERNAME": "Nama itu sudah dipakai. Coba nama lain.",
  "error.NOT_YOUR_TURN": "Belum giliranmu.",
  "error.PENDING_ACTION": "Masih ada aksi yang menunggu diselesaikan.",
  "error.WRONG_PHASE": "Aksi ini tidak bisa dilakukan sekarang.",
  "error.INVALID_CARD": "Kartu itu tidak valid.",
  "error.INVALID_TARGET": "Target itu tidak valid.",
  "error.NEED_TARGET": "Pilih dulu targetnya.",
  "error.CANNOT_PLAY_CARD": "Kartu itu tidak bisa dimainkan sekarang.",
  "error.LOCKED": "Kamu sedang terkunci, tidak bisa main kartu.",
  "error.NO_FREEZE": "Kamu tidak punya kartu Freeze.",
  "error.INVALID_GANG": "Kombinasi Gang itu tidak valid.",
  "error.DECK_EMPTY": "Deck sudah habis.",
  "error.UNKNOWN": "Ada yang error. Coba lagi ya.",
};

// ------------------------------------------------------------
// (b2) RULES OVERLAY — section headings + body for the in-app rules.
//      Warm, casual Indonesian (molten, mischievous, momentous).
//      Card names/descriptions are pulled from CARDS above — these
//      keys only cover the prose that isn't per-card.
// ------------------------------------------------------------
const RULES: StringTable = {
  "rules.title": "Cara Main",
  "rules.intro":
    "2–10 pemain, satu deck bersama, dan satu pertanyaan tiap giliran: berani tarik kartunya? Yang terakhir bertahan, menang. 😼",

  // Objective
  "rules.objective.title": "Tujuan",
  "rules.objective.body":
    "Jadilah pemain terakhir yang masih hidup. Semua orang menarik kartu dari deck yang sama — kalau kamu menarik Lava Cat (🌋) tanpa pegang Water Bucket (💧), kamu langsung tereliminasi. Bertahan lebih lama dari semua lawan, dan kemenangan jadi milikmu.",

  // How a turn works
  "rules.turn.title": "Alur Giliran",
  "rules.turn.body":
    "Saat giliranmu, kamu boleh main kartu sebanyak yang kamu mau — atau tidak sama sekali. Tapi untuk mengakhiri giliran, kamu WAJIB menarik satu kartu dari deck (kecuali sudah ada kartu yang menutup giliranmu, seperti Nap Time atau Eruption).",
  "rules.turn.draw":
    "Menariknya itu bagian yang deg-degan: kalau yang keluar Lava Cat dan kamu tidak punya Water Bucket, tamat. Kalau punya, Water Bucket otomatis menyelamatkanmu — lalu kamu diam-diam menaruh Lava Cat itu balik ke deck di posisi mana pun, biar lawan ikut deg-degan. 😈",

  // The deck & Lava Cats
  "rules.deck.title": "Deck & Lava Cat",
  "rules.deck.body":
    "Setiap pemain mulai dengan 6 kartu + 1 Water Bucket. Deck berisi (jumlah pemain − 1) Lava Cat yang terkubur acak — jadi selalu ada satu pemain lebih banyak daripada bahaya. Water Bucket ekstra ikut ditabur ke deck (2 untuk ≤4 pemain, 3 untuk 5–7, 4 untuk 8–10).",
  "rules.deck.reshuffle":
    "Kalau deck tarik sampai habis, tumpukan buangan (kecuali Lava Cat yang sudah meledak) dikocok ulang jadi deck baru. Permainan jalan terus, deg-degan tetap.",

  // The Freeze window (Nope)
  "rules.freeze.title": "Window Freeze",
  "rules.freeze.body":
    "Begitu sebuah kartu aksi atau Gang dimainkan, aksinya menggantung sebentar (~4 detik) sebelum benar-benar terjadi. Selama jeda itu, siapa pun yang pegang Freeze (❄️) boleh membatalkannya.",
  "rules.freeze.counter":
    "Dan Freeze itu sendiri bisa di-Freeze balik! Jumlah Freeze genap berarti aksi tetap jalan; ganjil berarti aksi batal. Perang Freeze bisa seru. ❄️",

  // Bunker
  "rules.bunker.title": "Bunker",
  "rules.bunker.body":
    "Bunker (🛡️) itu perisai sekali pakai yang kamu pasang di depanmu. Dia membatalkan efek negatif PERTAMA yang menyasarmu — tarik paksa, curian, Bribe, tukar tangan, Lockdown, bahkan tarikan Lava Cat — lalu hancur.",
  "rules.bunker.note":
    "Catatan: Bunker tidak menahan Flood, karena Flood kena semua orang sekaligus, bukan menyasar kamu khusus.",

  // Card reference section headers
  "rules.cards.title": "Daftar Kartu",
  "rules.section.danger": "Kartu Bahaya",
  "rules.section.action": "Kartu Aksi",
  "rules.section.gang": "Kartu Gang",

  // Gang combos
  "rules.combos.title": "Kombinasi Gang",
  "rules.combos.intro":
    "Kartu Gang ada 5 elemen — Fire (🔥), Ice (🧊), Storm (⚡), Earth (🌿), Shadow (🌑) — dan dimainkan sebagai set. Makin besar set-nya, makin ganas efeknya:",
  "rules.combos.pair.title": "Pasangan (2 sejenis)",
  "rules.combos.pair.body": "Curi satu kartu acak dari pemain pilihanmu.",
  "rules.combos.triple.title": "Trio (3 sejenis)",
  "rules.combos.triple.body":
    "Sebut satu jenis kartu — kalau target punya, kartu itu jadi milikmu. Kalau tidak, ya zonk.",
  "rules.combos.quad.title": "Kuartet (4 sejenis)",
  "rules.combos.quad.body": "Rampok satu kartu acak dari SEMUA lawan sekaligus. 💸",
  "rules.combos.rainbow.title": "Rainbow (5 elemen beda)",
  "rules.combos.rainbow.body": "Tukar seluruh isi tanganmu dengan tangan pemain pilihanmu.",

  // Win
  "rules.win.title": "Menang",
  "rules.win.body":
    "Saat hanya tersisa satu pemain hidup, dia menang. Selamat — kamu lebih licik dari lava. 🏆🌋",
};

/** Merged flat table for `t()` lookups. */
export const strings: StringTable = { ...CARDS, ...UI, ...RULES };

// ------------------------------------------------------------
// (c) EVENT TEMPLATES — turn a structured GameEvent into a localized
//     log/toast line. `nameOf` resolves a player id to a display name.
//     Exhaustive over GameEvent['kind'] (no default → TS flags gaps).
// ------------------------------------------------------------

/** Resolve a player id to a display name (falls back gracefully). */
export type NameResolver = (playerId: string) => string;

/** Localized name of a card type, used inside event lines. */
function cardLabel(type: GameEvent extends { cardType: infer T } ? T : never): string;
function cardLabel(type: string): string;
function cardLabel(type: string): string {
  // Derive the i18nKey form from the CardType by camelCasing the SNAKE_CASE.
  // e.g. LAVA_CAT → card.lavaCat.name. Kept local so this module is the only
  // place that maps event card types to localized names.
  const camel = type
    .toLowerCase()
    .replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
  return CARDS[`card.${camel}.name`] ?? type;
}

const COMBO_LABEL: Record<string, string> = {
  pair: "pasangan",
  triple: "trio",
  quad: "kuartet",
  rainbow: "rainbow",
};

/**
 * Render the Indonesian log/toast line for a single GameEvent.
 * Exhaustive switch — adding a new GameEvent kind without a case here
 * is a compile error.
 */
export function formatEvent(event: GameEvent, nameOf: NameResolver): string {
  switch (event.kind) {
    case "GAME_STARTED":
      return `Game dimulai! ${event.handSize} kartu per orang, ${event.lavaCount} Lava Cat di deck. 🌋`;
    case "TURN_STARTED":
      return `Giliran ${nameOf(event.playerId)}.`;
    case "CARD_PLAYED":
      return event.targetId
        ? `${nameOf(event.actorId)} main ${cardLabel(event.cardType)} ke ${nameOf(event.targetId)}.`
        : `${nameOf(event.actorId)} main ${cardLabel(event.cardType)}.`;
    case "GANG_PLAYED":
      return event.targetId
        ? `${nameOf(event.actorId)} main ${COMBO_LABEL[event.combo] ?? event.combo} Gang ke ${nameOf(event.targetId)}.`
        : `${nameOf(event.actorId)} main ${COMBO_LABEL[event.combo] ?? event.combo} Gang.`;
    case "CARD_DREW":
      return `${nameOf(event.playerId)} menarik kartu.`;
    case "NOPE_PLAYED":
      return event.negated
        ? `${nameOf(event.actorId)} nge-Freeze — aksinya batal! ❄️`
        : `${nameOf(event.actorId)} nge-Freeze.`;
    case "ACTION_NEGATED":
      return `${cardLabel(event.cardType)} dibatalkan oleh Freeze. ❄️`;
    case "LAVA_DRAWN":
      return event.defused
        ? `${nameOf(event.playerId)} menarik Lava Cat — tapi selamat pakai Water Bucket! 💧`
        : `${nameOf(event.playerId)} menarik Lava Cat! 🌋`;
    case "BUNKER_SAVED":
      return `Bunker ${nameOf(event.playerId)} menahan serangan! 🛡️`;
    case "BUNKER_SET":
      return `${nameOf(event.playerId)} memasang Bunker. 🛡️`;
    case "BUCKET_PLACED":
      return `${nameOf(event.playerId)} menaruh Lava Cat balik ke deck.`;
    case "ELIMINATED":
      return `${nameOf(event.playerId)} tereliminasi. 💀`;
    case "STEAL_RANDOM":
      return `${nameOf(event.actorId)} mencuri kartu acak dari ${nameOf(event.targetId)}.`;
    case "STEAL_NAMED":
      return `${nameOf(event.actorId)} mencuri ${cardLabel(event.cardType)} dari ${nameOf(event.targetId)}!`;
    case "STEAL_NONE":
      return `${nameOf(event.actorId)} menebak ${cardLabel(event.cardType)} ke ${nameOf(event.targetId)} — tapi meleset.`;
    case "GIFT_GIVEN":
      return `${nameOf(event.fromId)} memberi kartu ke ${nameOf(event.toId)}. 🎁`;
    case "HANDS_SWAPPED":
      return `${nameOf(event.actorId)} menukar tangan dengan ${nameOf(event.targetId)}.`;
    case "RAID":
      return `${nameOf(event.actorId)} merampok kartu dari semua orang! 💸`;
    case "SHUFFLED":
      return `${nameOf(event.actorId)} mengocok ulang deck.`;
    case "REVERSED":
      return `${nameOf(event.actorId)} membalik arah giliran. 🔄`;
    case "ATTACK":
      return `${nameOf(event.actorId)} menyerang ${nameOf(event.targetId)} — ${event.turns} giliran beruntun!`;
    case "SKIPPED":
      return `${nameOf(event.actorId)} melewati giliran.`;
    case "LOCKED":
      return `${nameOf(event.actorId)} mengunci ${nameOf(event.targetId)}. 🔒`;
    case "SPIED":
      return `${nameOf(event.actorId)} mengintip puncak deck. 🔭`;
    case "PEEK_SWAPPED":
      return event.swapped
        ? `${nameOf(event.actorId)} mengintip dan menukar kartu teratas.`
        : `${nameOf(event.actorId)} mengintip kartu teratas.`;
    case "FLOOD_STARTED":
      return `${nameOf(event.actorId)} memulai Flood — semua harus buang 1 kartu! 🌊`;
    case "FLOOD_DISCARDED":
      return `${nameOf(event.playerId)} membuang 1 kartu karena Flood.`;
    case "TIME_WARPED":
      return `${nameOf(event.actorId)} mengambil kartu dari buangan. 🪄`;
    case "FORCED_DRAW":
      return `${nameOf(event.actorId)} memaksa ${nameOf(event.targetId)} menarik kartu. 🎯`;
    case "PLAYER_AWAY":
      return event.away
        ? `${nameOf(event.playerId)} lagi AFK.`
        : `${nameOf(event.playerId)} sudah kembali.`;
    case "PLAYER_DISCONNECTED":
      return `${nameOf(event.playerId)} terputus.`;
    case "PLAYER_RECONNECTED":
      return `${nameOf(event.playerId)} tersambung lagi.`;
    case "AUTO_PLAYED":
      return `Giliran ${nameOf(event.playerId)} dimainkan otomatis.`;
    case "WIN":
      return `${nameOf(event.playerId)} memenangkan game! 🏆🌋`;
  }
}
