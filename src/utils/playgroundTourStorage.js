// Remember whether a guest has completed (or skipped) the playground tour.

const STORAGE_KEY = "mic_playground_tour_done";

export function hasCompletedPlaygroundTour() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPlaygroundTourCompleted() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}

export function clearPlaygroundTourCompleted() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
