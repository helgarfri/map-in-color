import React, { useState, useRef } from "react";
import styles from "./DataIntergration.module.css";

// Example preset sizes. You can add more or reorder as you like.
const PRESET_FONT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72];

export default function LegendFontSizeField({ legendFontSize, setLegendFontSize }) {
  // We'll keep a local input state so that the user can type freely
  const [inputValue, setInputValue] = useState(
    legendFontSize === null ? "" : String(legendFontSize)
  );

  // This state tracks whether the dropdown of preset options is open
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);

  // We'll close the dropdown if user clicks outside
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1) handle user typing in the input
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (!val) {
      // If empty => "Auto"
      setLegendFontSize(null);
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num > 0) {
        setLegendFontSize(num);
      }
      // If it’s invalid or <=0, ignore (or revert).
    }
  };

  // 2) handle focus => open the dropdown
  const handleFocus = () => {
    setIsOpen(true);
  };

  // 3) plus/minus logic
  const increment = () => {
    if (legendFontSize === null) {
      // If we were in “auto,” let’s jump to 12 by default
      setLegendFontSize(12);
      setInputValue("12");
    } else {
      const newVal = legendFontSize + 1;
      setLegendFontSize(newVal);
      setInputValue(String(newVal));
    }
  };

  const decrement = () => {
    if (legendFontSize === null) {
      setLegendFontSize(11);
      setInputValue("11");
    } else {
      const newVal = Math.max(1, legendFontSize - 1);
      setLegendFontSize(newVal);
      setInputValue(String(newVal));
    }
  };

  // 4) handle user clicking one of the preset sizes
  const handleClickOption = (sz) => {
    if (sz === "auto") {
      setLegendFontSize(null);
      setInputValue("");
    } else {
      setLegendFontSize(sz);
      setInputValue(String(sz));
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.fontSizeField} ref={containerRef}>
      <label className={styles.fontSizeLabel}>Legend Font Size:</label>

      <div className={styles.fontSizeInputContainer}>
        {/* Minus button */}
        <button className={styles.minusButton} onClick={decrement}>
          –
        </button>

        {/* Input */}
        <input
          type="text"
          className={styles.fontSizeInput}
          placeholder="Auto"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
        />

        {/* Plus button */}
        <button className={styles.plusButton} onClick={increment}>
          +
        </button>

        {/* If isOpen => show the custom dropdown */}
        {isOpen && (
          <div className={styles.customDropdown}>
            {/* “Auto” option */}
            <div
              className={styles.dropdownItem}
              onClick={() => handleClickOption("auto")}
            >
              Auto
            </div>
            {/* Preset numeric sizes */}
            {PRESET_FONT_SIZES.map((sz) => (
              <div
                key={sz}
                className={styles.dropdownItem}
                onClick={() => handleClickOption(sz)}
              >
                {sz}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
