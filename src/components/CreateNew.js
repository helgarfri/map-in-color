// src/components/CreateNew.js
import React, { useState } from 'react';
import SelectMap from './SelectMap';
import FinalizeMap from './FinalizeMap';
import DataIntegration from './DataIntergration';

export default function CreateNew({

}) {
  const [step, setStep] = useState(1);
  const [selected_map, setSelectedMap] = useState(null);
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
          selected_map={selected_map}
          setSelectedMap={setSelectedMap}
          continueToNextStep={goToNextStep}
        />
      )}
      {step === 2 && (
        <DataIntegration
          selected_map={selected_map}
          csvData={csvData}
          setCsvData={setCsvData}
          goToNextStep={goToNextStep}
          goBack={goBack}

        />
      )}
      {step === 3 && (
        <FinalizeMap
          selected_map={selected_map}
          csvData={csvData}
          goBack={goBack}
          goToNextStep={goToNextStep}
        />
      )}
    </div>
  );
}
