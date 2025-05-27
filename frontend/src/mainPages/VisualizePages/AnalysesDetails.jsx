// AnalysisDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AnalysesChart from './AnalysesChart';
import './AnalysesDetails.css';

const AnalysesDetails = () => {
  const { testName } = useParams();
  const [data, setData] = useState([]);
  const [unit, setUnit] = useState('');
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/analyses/by-name/${encodeURIComponent(testName)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.map(test => ({
          date: new Date(test.test_date).toLocaleDateString('ro-RO'),
          value: parseFloat(test.test_value)
        }));

        setData(formatted);
        setUnit(res.data[0].test_unit);
        setMin(res.data[0].reference_range?.min || null);
        setMax(res.data[0].reference_range?.max || null);
      } catch (err) {
        console.error(err);
        setError('Eroare la încărcarea datelor.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testName]);

  return (
    <div className="main-container">
      {loading ? (
        <div className="loading-state">Se încarcă...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <AnalysesChart
          data={data}
          testName={testName}
          unit={unit}
          min={min}
          max={max}
        />
      )}
    </div>
  );
};

export default AnalysesDetails;
