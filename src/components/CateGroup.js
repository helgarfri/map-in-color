import styles from './Data.module.css'
export default function CateGroup({
    color,
    handleColorChange,
    category,
    unknownCount,
    isOpen,
    toggleCategory
}) {
    return (
        <div className={styles.categoryHeader}>
        <input
          type="color"
          value={color}
          className={styles.colorInp}
          onChange={(e) => handleColorChange(e.target.value, category)}
        />
          <h3>{category}</h3>
            {unknownCount > 0 && (
              <span className={styles.unknownMessage}>
                {unknownCount} {unknownCount === 1 ? 'item' : 'items'} not found
              </span>
            )}
            <button
              aria-expanded={isOpen}
              onClick={() => toggleCategory(category)}
              className={`${styles.toggleButton} ${isOpen ? styles.rotated : ''}`}
            >
              ▼
            </button>
         
      </div>
    )
}