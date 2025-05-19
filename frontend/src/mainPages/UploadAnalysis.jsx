import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadAnalysis.css';

export default function UploadAnalysis() {
  const navigate = useNavigate();

  // ✅ Redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      setFile(null);
      setMessage('Te rog selectează un fișier PDF valid.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleAddTestClick = () => {
    fileInputRef.current.click();
  };

  const handleCancelClick = () => {
    setFile(null);
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage('Te rog selectează un fișier PDF.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setData(response.data.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'A apărut o eroare.');
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Medical Analysis</h2>
      
      <div className="upload-sections">
        <div 
          className={`upload-section ${dragActive ? "drag-active" : ""} ${file ? "file-selected" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
              <path d="M12 11v6"></path>
              <path d="M9 14h6"></path>
            </svg>
          </div>
          
          {file ? (
            <p className="upload-text">{file.name}</p>
          ) : (
            <>
              <p className="upload-text">Drag and drop your files here</p>
              <p className="upload-subtext">Support for PDF files</p>
            </>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="file-input"
          />
          
          <div className="button-container">
            {file ? (
              <>
                <button className="cancel-button" onClick={handleCancelClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Cancel
                </button>
                <button className="submit-button" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Se trimite...' : 'Trimite'}
                </button>
              </>
            ) : (
              <button className="browse-button" onClick={handleBrowseClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Browse Files
              </button>
            )}
          </div>
        </div>
        
        <div className="upload-section">
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
              <path d="M12 11v6"></path>
              <path d="M9 14h6"></path>
            </svg>
          </div>
          <p className="upload-text">Or add them manually</p>
          
          <div className="button-container">
            <button className="add-test-button" onClick={handleAddTestClick}>
              <span>+</span> Add a test
            </button>
          </div>
        </div>
      </div>
      
      {message && (
        <div className="message-container">
          <p className="message">{message}</p>
        </div>
      )}
      
      {data && (
        <div className="data-container">
          <pre className="data-display">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}