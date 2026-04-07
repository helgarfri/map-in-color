import React, { useEffect, useRef, useState } from "react";
import styles from "./MicrostatesCustomModal.module.css";

export default function MicrostatesCustomModal({
  isOpen,
  microstatesList = [],
  selectedCodes = null,
  onSave,
  onCancel,
}) {
  const allCodes = microstatesList.map((m) => m.code);
  const [checked, setChecked] = useState(() => new Set(allCodes));
  const [searchQuery, setSearchQuery] = useState("");
  const cancelRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setSearchQuery("");
    const codes = microstatesList.map((m) => m.code);
    if (selectedCodes == null) {
      setChecked(new Set(codes));
    } else {
      setChecked(new Set(selectedCodes.map((c) => String(c).toUpperCase().trim())));
    }
  }, [isOpen, selectedCodes, microstatesList]);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  const query = searchQuery.trim().toLowerCase();
  const filteredList = query
    ? microstatesList.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.code.toLowerCase().includes(query)
      )
    : microstatesList;

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus?.();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  const toggle = (code) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const selectAll = () => setChecked(new Set(allCodes));
  const deselectAll = () => setChecked(new Set());

  const handleSave = () => {
    onSave?.(Array.from(checked));
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => onCancel?.()}
      role="presentation"
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="microstates-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="microstates-modal-title" className={styles.title}>
            Customize visible microstates
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onCancel}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <p className={styles.description}>
          Check the microstates and small territories you want to show on the map. Unchecked items will be hidden.
        </p>
        <div className={styles.toolbar}>
          <button type="button" className={styles.linkBtn} onClick={selectAll}>
            Select all
          </button>
          <span className={styles.sep}>·</span>
          <button type="button" className={styles.linkBtn} onClick={deselectAll}>
            Deselect all
          </button>
        </div>
        <div className={styles.searchWrap}>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search microstates…"
            className={styles.searchInput}
            aria-label="Search microstates"
          />
        </div>
        <div className={styles.listWrap}>
          {filteredList.length === 0 ? (
            <p className={styles.noResults}>
              {query ? "No microstates match your search." : "No microstates."}
            </p>
          ) : (
          <ul className={styles.list}>
            {filteredList.map(({ code, name }) => (
              <li key={code} className={styles.row}>
                <label className={styles.label}>
                  <input
                    type="checkbox"
                    checked={checked.has(code)}
                    onChange={() => toggle(code)}
                    className={styles.checkbox}
                  />
                  <span className={styles.name}>{name}</span>
                  <span className={styles.code}>{code}</span>
                </label>
              </li>
            ))}
          </ul>
          )}
        </div>
        <div className={styles.footer}>
          <button
            ref={cancelRef}
            type="button"
            className={styles.cancelPill}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryPill}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
