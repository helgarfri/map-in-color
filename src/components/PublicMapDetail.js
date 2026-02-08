// PublicMapDetail.jsx
import React from "react";
import HomeFooter from "./HomeFooter";
import MapDetailContent from "./MapDetailContent";
import styles from "./PublicMapDetail.module.css";
import Header from "./Header";

export default function PublicMapDetail() {
  return (
    <div className={styles.publicMapDetailContainer}>
      <Header />
      <MapDetailContent isFullScreen={false} toggleFullScreen={() => {}} />
      <HomeFooter />
    </div>
  );
}
