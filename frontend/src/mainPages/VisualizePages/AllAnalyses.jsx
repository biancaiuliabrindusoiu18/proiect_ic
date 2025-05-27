
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnalysisCard from './AnalysesCard';
import './AllAnalyses.css';

const AllAnalyses = () => {
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
       const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/analyses/latest', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAnalyses(res.data);
        analyses.sort((a, b) => a.test_name.localeCompare(b.test_name));

      } catch (err) {
        console.error(err);
        setError('Nu s-au putut încărca analizele.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  return (
    <div className="main-container">
      <div className="page-header">
        <h1 className="page-title">Last Tests</h1>
        <p className="page-subtitle">See the latest results for each test taken</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : analyses.length === 0 ? (
        <div className="empty-state">
          <h3>No analyses to show</h3>
          <p>Add manualy or upload a pdf to start</p>
          <button className="action-button" onClick={() => window.location.href = '/upload-analyses'}>
            Add new test results</button>
        </div>
      ) : (
        <div className="analysis-grid">
          {analyses.map((a) => (
            <AnalysisCard key={a._id} analysis={a} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAnalyses;
