// cycleWidget.js — drives the #cycle-widget component: fetches each cycle's
// state/expiry from the API and renders a locally-ticking countdown.
// UI text is in Portuguese; edit STATE_LABELS below to fix translations.

import { CONFIG } from "./config.js";
import { fetchWorldstate } from "./warframeApi.js";

// Maps the API's raw state values to Portuguese display labels.
// Unknown/new states fall back to the raw value capitalized.
const STATE_LABELS = {
  day: "Agora: Dia",
  night: "Agora: Noite",
};

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
    ? `Tempo restante: ${hours}:${pad(minutes)}:${pad(seconds)}`
    : `Tempo restante: ${minutes}:${pad(seconds)}`;
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

      const label = STATE_LABELS[cycleState]
        || (cycleState.charAt(0).toUpperCase() + cycleState.slice(1));
      this.stateEl.textContent = label;
      // CSS class stays keyed to the raw (English) state so cycle-widget.css
      // selectors like .state.day / .state.night keep working untranslated.
      this.stateEl.className = `state ${cycleState}`;
    } catch (err) {
      this.stateEl.textContent = "Erro";
      this.stateEl.className = "state err";
      // eslint-disable-next-line no-console
      console.error(`[cycleWidget] falha ao atualizar ${this.key}:`, err);
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
