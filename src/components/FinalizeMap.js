export default function FinalizeMap({
    selectedMap,
    selectedType,
    finalize,
    goBack
}) {
    return(
        <div>
      <h2>Finalize Your Creation</h2>
      <p>You have selected:</p>
      <ul>
        <li>Map: {selectedMap}</li>
        <li>Type: {selectedType}</li>
      </ul>
      <button onClick={finalize}>Finalize Creation</button>
      <button onClick={goBack}>Go Back and Edit</button>
    </div> 
    )
}