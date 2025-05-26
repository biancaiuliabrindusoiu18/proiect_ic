import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AnalysesForm from './AnalysesForm';
import './ManualEntry.css';

const VerifyData = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const preloadedFields = location.state?.data;

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preloadedFields && Array.isArray(preloadedFields)) {
      const mappedFields = preloadedFields.map(field => ({
        name: field.nume || '',
        value: field.valoare || '',
        unit: field.unit || '',
        date: field.data 
              ? field.data.split('.').reverse().join('-')
              : new Date().toISOString().slice(0, 10),
        referenceType: field.intv?.nonvalue !== null ? 'label' : 'minmax',
        min: field.intv?.min || '',
        max: field.intv?.max || '',
        label: field.intv?.nonvalue || ''
      }));
      setFields(mappedFields);
    } else {
      navigate('/upload-analyses');
    }
  }, [preloadedFields, navigate]);

  const saveAnalysesData = async (analysesData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Token trimis:', token); // trebuie să vezi un JWT, nu null
    const response = await axios.post(
      'http://localhost:5000/api/analyses/add-analyses',
      analysesData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    // Axios pune răspunsul de la backend în error.response
    throw error;
  }
};

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Save each field as a separate analyses
      const savePromises = fields.map(field => {
        // Convert date from YYYY-MM-DD to DD.MM.YYYY format expected by backend
        const formattedDate = field.date.split('-').reverse().join('.');
        
        const analysesData = {
          nume: field.name,
          valoare: field.value,
          unit: field.unit,
          data: formattedDate,
          intv: {
            min: field.referenceType === 'minmax' ? field.min : null,
            max: field.referenceType === 'minmax' ? field.max : null,
            nonvalue: field.referenceType === 'label' ? field.label : null
          }
        };

        return saveAnalysesData(analysesData);
      });

      await Promise.all(savePromises);
      
      console.log('All analyses saved successfully');
      setError('');
      
      // Redirect to success or another page
      navigate('/home');
      
    } catch (error) {
      console.error('Error saving data:', error);
      if (error.response?.data?.msg) {
        setError(error.response.data.msg);
      } else {
        setError(error.message || 'There was an error saving the data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/upload-analyses');
  };

  return (
    <div className="manual-entry-container">
      <h2>Verify Your Data</h2>

      <AnalysesForm fields={fields} setFields={setFields} />

      <div className="form-actions">
        <button className="cancel-button" onClick={handleCancel} disabled={loading}>
          Cancel
        </button>
        <button 
          className="save-button" 
          onClick={handleSave} 
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default VerifyData;