// config.js — site-wide constants. Edit these to change platform, refresh rates, etc.

export const CONFIG = {
  // Warframe platform: "pc" | "ps4" | "xb1" | "swi"
  PLATFORM: "pc",

  // How often to re-fetch each cycle from the API (ms)
  CYCLE_FETCH_INTERVAL_MS: 30_000,

  // How often to redraw the local countdown (ms)
  CYCLE_TICK_INTERVAL_MS: 1_000,
};
