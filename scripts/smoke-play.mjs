// Wire-level smoke test: two real colyseus.js clients play against a running
// server, exercising create/join/WELCOME/START_GAME/deal/turn flow over the
// actual "c"/"s" channels. Run with the backend up:  node scripts/smoke-play.mjs
import { Client } from "colyseus.js";

const URL = process.env.VC_URL || "ws://localhost:3017";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function assert(cond, msg) {
  if (!cond) throw new Error("ASSERT FAILED: " + msg);
  console.log("  ✓ " + msg);
}

function track(room) {
  const ref = { state: null, hand: [], id: null };
  room.onMessage("s", (m) => {
    if (m.t === "STATE") ref.state = m.state;
    else if (m.t === "HAND") ref.hand = m.cards;
    else if (m.t === "WELCOME") ref.id = m.playerId;
  });
  return ref;
}

async function main() {
  const c1 = new Client(URL);
  const c2 = new Client(URL);

  const room1 = await c1.create("volcano_cats", { username: "Alice" });
  const a = track(room1);
  await wait(300);
  const room2 = await c2.joinById(room1.roomId, { username: "Bob" });
  const b = track(room2);
  await wait(500);

  assert(a.id && b.id && a.id !== b.id, "both clients got distinct WELCOME ids");
  assert(a.state?.players.length === 2, "lobby has 2 players");

  room1.send("c", { t: "START_GAME" });
  await wait(600);
  assert(a.state?.status === "playing", "game started");
  assert(a.hand.length === 7, `Alice dealt 7 cards (got ${a.hand.length})`);
  assert(b.hand.length === 7, `Bob dealt 7 cards (got ${b.hand.length})`);
  assert(!a.hand.some((c) => c.type === "LAVA_CAT"), "no Lava Cat in starting hand");

  const firstTurn = a.state.turnOrder[a.state.currentTurnIndex];
  const deckBefore = a.state.deckCount;
  (firstTurn === a.id ? room1 : room2).send("c", { t: "DRAW" });
  await wait(500);
  // If the drawer hit their own Lava Cat, they auto-used a Water Bucket and
  // must place it; do so to let the turn resolve.
  if (a.state.phase.kind === "await_bucket") {
    (a.state.phase.playerId === a.id ? room1 : room2).send("c", { t: "PLACE_BUCKET", position: 5 });
    await wait(500);
  }
  assert(a.state.deckCount < deckBefore || a.state.status === "finished", "a card left the deck on draw");
  assert(
    a.state.status === "finished" || a.state.turnOrder[a.state.currentTurnIndex] !== firstTurn,
    "turn advanced (or game ended) after a draw",
  );

  // Error path: a non-turn player drawing should yield an ERROR, not a crash.
  let gotError = false;
  const offTurn = a.state.turnOrder[a.state.currentTurnIndex] === a.id ? room2 : room1;
  offTurn.onMessage("s", (m) => {
    if (m.t === "ERROR") gotError = true;
  });
  offTurn.send("c", { t: "DRAW" });
  await wait(300);
  assert(gotError, "out-of-turn draw rejected with ERROR");

  await room1.leave();
  await room2.leave();
  console.log("\nSMOKE OK ✅");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nSMOKE FAILED ❌:", err.message);
  process.exit(1);
});
