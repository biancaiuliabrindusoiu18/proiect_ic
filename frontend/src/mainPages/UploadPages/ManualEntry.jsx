import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AnalysesForm from './AnalysesForm';
import './ManualEntry.css';

const ManualEntry = () => {
  const [fields, setFields] = useState([
    {
      name: '',
      value: '',
      unit: '',
      date: new Date().toISOString().slice(0, 10),
      referenceType: 'minmax',
      min: '',
      max: '',
      label: ''
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const saveAnalysesData = async (analysesData) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/analyses/add-analyses',
        analysesData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const savePromises = fields.map(field => {
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
      <h2>Add Analyses Manually</h2>

      <AnalysesForm fields={fields} setFields={setFields} />

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button className="cancel-button" onClick={handleCancel} disabled={loading}>
          Cancel
        </button>
        <button className="save-button" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default ManualEntry;
