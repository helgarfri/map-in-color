import DataUploaderCate from "./DataUploaderCate";

export default function DataCate({goBack}) {
    return (
      <div>
        <button onClick={goBack}>Go Back</button>
        <h2>Data Integration</h2>
        <DataUploaderCate/>

      </div>
    );
  }
  