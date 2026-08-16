// warframeApi.js — thin wrapper around the api.warframestat.us worldstate API.
// Docs: https://docs.warframestat.us/

import { CONFIG } from "./config.js";

const BASE_URL = "https://api.warframestat.us";

/**
 * Fetch a single worldstate resource, e.g. "cetusCycle", "vallisCycle", "cambionCycle".
 * @param {string} resource
 * @returns {Promise<object>}
 */
export async function fetchWorldstate(resource) {
  const url = `${BASE_URL}/${CONFIG.PLATFORM}/${resource}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Worldstate request failed (${res.status}) for ${resource}`);
  }
  return res.json();
}
