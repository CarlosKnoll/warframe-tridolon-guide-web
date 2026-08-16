// cycleWidget.js — drives the #cycle-widget component: fetches each cycle's
// state/expiry from the API and renders a locally-ticking countdown.

import { CONFIG } from "./config.js";
import { fetchWorldstate } from "./warframeApi.js";

/**
 * Format a millisecond duration as H:MM:SS or M:SS.
 * @param {number} ms
 * @returns {string}
 */
function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

class CycleCard {
  /**
   * @param {HTMLElement} el - the .cycle-card element
   */
  constructor(el) {
    this.el = el;
    this.key = el.dataset.cycle; // e.g. "cetusCycle"
    this.stateEl = el.querySelector(".state");
    this.timerEl = el.querySelector(".timer");
    this.expiryMs = null;
  }

  async refresh() {
    try {
      const data = await fetchWorldstate(this.key);
      const cycleState = (data.state || "unknown").toLowerCase();
      this.expiryMs = new Date(data.expiry).getTime();

      this.stateEl.textContent = cycleState.charAt(0).toUpperCase() + cycleState.slice(1);
      this.stateEl.className = `state ${cycleState}`;
    } catch (err) {
      this.stateEl.textContent = "Error";
      this.stateEl.className = "state err";
      // eslint-disable-next-line no-console
      console.error(`[cycleWidget] failed to refresh ${this.key}:`, err);
    }
  }

  tick() {
    if (this.expiryMs == null) return;
    const remaining = this.expiryMs - Date.now();
    this.timerEl.textContent = formatDuration(remaining);
  }
}

/**
 * Initialize the cycle widget: finds all .cycle-card elements inside the
 * given container, wires up fetch + tick loops.
 * @param {string} containerSelector
 */
export function initCycleWidget(containerSelector = "#cycle-widget") {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".cycle-card")).map(
    (el) => new CycleCard(el)
  );

  const refreshAll = () => cards.forEach((card) => card.refresh());
  const tickAll = () => cards.forEach((card) => card.tick());

  refreshAll();
  setInterval(refreshAll, CONFIG.CYCLE_FETCH_INTERVAL_MS);
  setInterval(tickAll, CONFIG.CYCLE_TICK_INTERVAL_MS);
}
