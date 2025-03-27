import React from 'react';
import styles from './Terms.module.css';


export default function Terms() {
    return (
        <div>

<div className={styles.logoSection} onClick={() => window.location.href = '/'}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = '/';
            }
            }}>
            <img
                src="/assets/map-in-color-logo.png"
                alt="Map in Color Logo"
                className={styles.logo}
            />
            <h1 className={styles.brandTitle}>Map in Color</h1>
        </div>

           
            <iframe

                src="/terms.html"
                style={{ width: '100%', height: '100vh', border: 'none' }}
                title="Terms of Use"
            ></iframe>
           
            
        </div>
    );
}