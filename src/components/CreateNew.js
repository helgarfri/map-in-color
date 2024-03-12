import React, { useState } from 'react';
import SelectMap from './SelectMap';
import SelectType from './SelectType';
import DataCate from './DataCate';
import DataChor from './DataChor';

export default function CreateNew() {
  const [step, setStep] = useState(1);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goBack = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {step === 1 && <SelectMap selectedMap={selectedMap} setSelectedMap={setSelectedMap} continueToNextStep={goToNextStep} />}
      {step === 2 && <SelectType selectedType={selectedType} setSelectedType={setSelectedType} continueToNextStep={goToNextStep} goBack={goBack} />}
      {step === 3 && selectedType === 'categorical' && <DataCate goBack={goBack} />}
      {step === 3 && selectedType === 'choropleth' && <DataChor goBack={goBack} />}
    </div>
  );
}
