// PublicMapDetail.jsx
import React, { useState } from "react";
import HomeFooter from "./HomeFooter";
import HomeHeader from "./HomeHeader";
import MapDetailContent from "./MapDetailContent";
import styles from "./PublicMapDetail.module.css";

export default function PublicMapDetail() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className={styles.publicMapDetailContainer}>
      {!isFullScreen && <HomeHeader />}
      <div className={isFullScreen ? styles.publicMapDetailContentWrapFullScreen : styles.publicMapDetailContentWrap}>
        <MapDetailContent
          isFullScreen={isFullScreen}
          toggleFullScreen={() => setIsFullScreen((v) => !v)}
        />
      </div>
      {!isFullScreen && <HomeFooter />}
    </div>
  );
}
