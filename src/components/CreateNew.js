import React, { useState } from 'react';
import SelectMap from './SelectMap';
import SelectType from './SelectType';
import DataIntergration from './DataIntergration';
import DataChor from './DataChor';
import FinalizeMap from './FinalizeMap'; // Import the new component

export default function CreateNew() {
  const [step, setStep] = useState(1);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [csvData, setCsvData] = useState(null);


  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goBack = () => {
    setStep(step - 1);
  };

 

  const finalizeCreation = () => {
    console.log('Finalizing Creation with:', { selectedMap, selectedType });
    // Here, you would handle the finalization logic,
    // such as saving to a database, showing a success message, etc.
    // For this example, we'll just log the selections to the console.
  };

  return (
    <div>
      {step === 1 && <SelectMap selectedMap={selectedMap} setSelectedMap={setSelectedMap} continueToNextStep={goToNextStep} />}
      {step === 2 && <SelectType selectedType={selectedType} setSelectedType={setSelectedType} continueToNextStep={goToNextStep} goBack={goBack} />}
      {step === 3 && <DataIntergration selectedMap={selectedMap} csvData={csvData} setCsvData={setCsvData} goToNextStep={goToNextStep} goBack={goBack} />}

      {step === 4 && <FinalizeMap selectedMap={selectedMap} selectedType={selectedType} csvData={csvData} goBack={goBack} goToNextStep={goToNextStep} finalize={finalizeCreation} />}
    </div>
  );
}
