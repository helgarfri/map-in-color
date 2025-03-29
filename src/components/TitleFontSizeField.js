import React, { useState, useRef, useEffect } from "react";
import styles from "./DataIntergration.module.css";

const PRESET_FONT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72];

export default function TitleFontSizeField({ titleFontSize, setTitleFontSize }) {
  // Local state for the input value
  const [inputValue, setInputValue] = useState(titleFontSize === null ? "" : String(titleFontSize));

  // Sync the local inputValue when titleFontSize prop changes.
  useEffect(() => {
    setInputValue(titleFontSize === null ? "" : String(titleFontSize));
  }, [titleFontSize]);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle changes in the input field
  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (!val) {
      setTitleFontSize(null); // "Auto"
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num > 0) {
        setTitleFontSize(num);
      }
    }
  };

  // Open the dropdown when the input gains focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Plus/minus button logic
  const increment = () => {
    if (titleFontSize === null) {
      setTitleFontSize(12);
      setInputValue("12");
    } else {
      const newVal = titleFontSize + 1;
      setTitleFontSize(newVal);
      setInputValue(String(newVal));
    }
  };

  const decrement = () => {
    if (titleFontSize === null) {
      setTitleFontSize(11);
      setInputValue("11");
    } else {
      const newVal = Math.max(1, titleFontSize - 1);
      setTitleFontSize(newVal);
      setInputValue(String(newVal));
    }
  };

  // Handle selection from the preset dropdown
  const handleClickOption = (sz) => {
    if (sz === "auto") {
      setTitleFontSize(null);
      setInputValue("");
    } else {
      setTitleFontSize(sz);
      setInputValue(String(sz));
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.fontSizeField} ref={containerRef}>
      <label className={styles.fontSizeLabel}>Title Font Size:</label>
      <div className={styles.fontSizeInputContainer}>
        <button className={styles.minusButton} onClick={decrement}>
          –
        </button>
        <input
          type="text"
          className={styles.fontSizeInput}
          placeholder="Auto"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <button className={styles.plusButton} onClick={increment}>
          +
        </button>
        {isOpen && (
          <div className={styles.customDropdown}>
            <div className={styles.dropdownItem} onClick={() => handleClickOption("auto")}>
              Auto
            </div>
            {PRESET_FONT_SIZES.map((sz) => (
              <div key={sz} className={styles.dropdownItem} onClick={() => handleClickOption(sz)}>
                {sz}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
