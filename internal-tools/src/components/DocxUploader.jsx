import React, { useState } from 'react';

function DocxUploader() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
const handleUpload = async () => {
  if (!file) {
    alert('Please select a file first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:5000/convert', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to download file. Server responded with ${res.status}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Upload error:', error);
    alert('Error uploading file: ' + error.message);
  }
};


  return (
    <div>
      <h2>Upload a DOCX file</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '1rem' }}>
        Convert to HTML
      </button>
      {file && <p>Selected file: {file.name}</p>}
    </div>
  );
}

export default DocxUploader;
