import React, { useEffect, useState } from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import MapDetailContent from './MapDetailContent';
import styles from './PublicMapDetail.module.css';
// Suppose you have a similar fetchMapById or a different call
import { fetchMapById } from '../api';
import { useParams } from 'react-router-dom';
import Header from './Header';

export default function PublicMapDetail() {
  const { id } = useParams();
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function getMap() {
      try {
        setIsLoading(true);
        const response = await fetchMapById(id);
        setMapData(response.data);
      } catch (err) {
        console.error('Error fetching map:', err);
        setErrorMessage('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    }
    getMap();
  }, [id]);

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className={styles.publicMapDetailContainer}>
      {/* Always render the public header + footer */}
      <Header />

      {/* Pass isLoading down so MapDetailContent does the skeleton or real UI */}
      <MapDetailContent
        isLoading={isLoading}
        mapData={mapData}
        authToken={null}
        profile={null}
      />

      <HomeFooter />
    </div>
  );
}
