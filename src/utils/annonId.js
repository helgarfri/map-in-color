// src/utils/anonId.js
export function getAnonId() {
  const key = "mic_anon_id";
  let id = localStorage.getItem(key);

  if (!id) {
    // modern browsers: crypto.randomUUID()
    id = (crypto?.randomUUID?.() ?? `anon_${Date.now()}_${Math.random().toString(16).slice(2)}`);
    localStorage.setItem(key, id);
  }

  return id;
}
