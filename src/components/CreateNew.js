// src/components/CreateNew.js
import React, { useState } from 'react';
import SelectMap from './SelectMap';
import FinalizeMap from './FinalizeMap';
import DataIntegration from './DataIntergration';

export default function CreateNew({
  isAuthenticated,
  setIsAuthenticated,

}) {
  const [step, setStep] = useState(1);
  const [selectedMap, setSelectedMap] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goBack = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {step === 1 && (
        <SelectMap
          selectedMap={selectedMap}
          setSelectedMap={setSelectedMap}
          continueToNextStep={goToNextStep}
        />
      )}
      {step === 2 && (
        <DataIntegration
          selectedMap={selectedMap}
          csvData={csvData}
          setCsvData={setCsvData}
          goToNextStep={goToNextStep}
          goBack={goBack}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      {step === 3 && (
        <FinalizeMap
          selectedMap={selectedMap}
          csvData={csvData}
          goBack={goBack}
          goToNextStep={goToNextStep}
        />
      )}
    </div>
  );
}
