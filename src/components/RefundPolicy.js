import React from 'react';
import styles from './RefundPolicy.module.css';


export default function RefundPolicy() {
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
                src="/assets/3-0/mic-logo-2-5-text-cropped.png"
                alt="Map in Color"
                className={styles.logo}
            />
        </div>

           
            <iframe
                src="/refund.html"
                style={{ width: '100%', height: '100vh', border: 'none' }}
                title="Refund Policy"
            ></iframe>
           
            
        </div>
    );
}
