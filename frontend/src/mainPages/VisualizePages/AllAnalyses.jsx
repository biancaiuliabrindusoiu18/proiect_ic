
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
        <h1 className="page-title">Ultimele Analize</h1>
        <p className="page-subtitle">Vezi cele mai recente rezultate pentru fiecare tip de test.</p>
      </div>

      {loading ? (
        <div className="loading-state">Se încarcă...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : analyses.length === 0 ? (
        <div className="empty-state">
          <h3>Nu ai încă nicio analiză</h3>
          <p>Adaugă manual sau încarcă un fișier PDF pentru a începe.</p>
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
