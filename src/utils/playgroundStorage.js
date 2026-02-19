// Playground draft storage: one draft per guest (anon id), with TTL.
// When user signs up and visits /create, we load this draft so their work isn't lost.

import { getAnonId } from "./annonId";

const STORAGE_KEY_PREFIX = "mic_playground_draft_";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getStorageKey() {
  return STORAGE_KEY_PREFIX + getAnonId();
}

/**
 * @returns {{ payload: object, updatedAt: string } | null} Draft or null if missing/expired.
 */
export function getPlaygroundDraft() {
  try {
    const key = getStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const { payload, updatedAt } = JSON.parse(raw);
    if (!payload || !updatedAt) return null;

    const age = Date.now() - new Date(updatedAt).getTime();
    if (age > TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return { payload, updatedAt };
  } catch {
    return null;
  }
}

/**
 * Save a draft (same shape as buildSavePayload in DataIntegration).
 * @param {object} payload
 */
export function setPlaygroundDraft(payload) {
  try {
    const key = getStorageKey();
    const value = JSON.stringify({
      payload: payload || {},
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn("Playground draft save failed:", e);
  }
}

/**
 * Clear the current guest's playground draft (e.g. after saving to account).
 */
export function clearPlaygroundDraft() {
  try {
    localStorage.removeItem(getStorageKey());
  } catch {}
}
