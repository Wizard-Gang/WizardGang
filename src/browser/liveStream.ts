// Twitch's player iframe posts `twitch-embed` events to its parent window; Twitch's
// embed script only forwards them. Reading them here keeps the CSP free of
// third-party scripts and needs no API key.
export const TWITCH_PLAYER_ORIGIN = "https://player.twitch.tv";
const EMBED_NAMESPACE = "twitch-embed";
const PLAYER_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox";

export type LiveState = "online" | "offline";

export function twitchPlayerUrl(channel: string, parent: string): string {
  const query = new URLSearchParams({ channel, parent, autoplay: "true", muted: "true" });
  return `${TWITCH_PLAYER_ORIGIN}/?${query.toString()}`;
}

export function liveStateFromMessage(data: unknown): LiveState | null {
  if (typeof data !== "object" || data === null) return null;
  const { namespace, eventName } = data as { namespace?: unknown; eventName?: unknown };
  if (namespace !== EMBED_NAMESPACE) return null;
  return eventName === "online" || eventName === "offline" ? eventName : null;
}

// The section ships hidden; it is shown only while the player reports the channel live.
export function initializeLiveStream(documentRoot: Document, browserWindow: Window): boolean {
  const section = documentRoot.querySelector<HTMLElement>("[data-twitch-channel]");
  const frame = section?.querySelector<HTMLElement>(".live-frame");
  const channel = section?.dataset.twitchChannel;
  const parent = browserWindow.location?.hostname;
  if (!section || !frame || !channel || !parent) return false;

  const player = documentRoot.createElement("iframe");
  player.src = twitchPlayerUrl(channel, parent);
  player.title = section.dataset.playerTitle ?? "Twitch";
  player.allow = "autoplay; fullscreen";
  player.setAttribute("sandbox", PLAYER_SANDBOX);

  browserWindow.addEventListener("message", (event: MessageEvent) => {
    if (event.origin !== TWITCH_PLAYER_ORIGIN || event.source !== player.contentWindow) return;
    const state = liveStateFromMessage(event.data);
    if (state) section.hidden = state === "offline";
  });
  frame.append(player);
  return true;
}
