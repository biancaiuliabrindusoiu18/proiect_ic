import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import DataAnalysesCard from './DataAnalysesCard';

const Home = () => {
  const navigate = useNavigate();
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchRecentTests = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/analyses/recent', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRecentTests(response.data);
      } catch (err) {
        setError('Failed to load recent tests');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTests();
  }, [navigate]);

  // Navighează către pagina ce arată toate testele pentru o dată dată
  const handleDateClick = (date) => {
    navigate(`/tests-by-date/${date}`);
  };

  // Funcție pentru a calcula numărul de teste normale și anormale
  const calculateTestResults = (tests) => {
    let normalCount = 0;
    let abnormalCount = 0;

    tests.forEach(test => {
      // Verifică dacă valoarea testului este în intervalul de referință
      const isNormal = checkIfTestIsNormal(test);
      if (isNormal) {
        normalCount++;
      } else {
        abnormalCount++;
      }
      
    });
    const total = normalCount + abnormalCount;

      let status;
      if (abnormalCount === 0) {
        status = "Very Good";
      } else {
        const percent = (abnormalCount / total) * 100;
        if (percent <= 10) {
          status = "Good";
        } else if (percent <= 30) {
          status = "Warning";
        } else {
          status = "Bad";
        }
      }


    return { normalCount, abnormalCount, status };
  };


  const checkIfTestIsNormal = (test) => {
    if (!test.reference_range) return true; // Dacă nu există interval de referință, considerăm normal
    
    const value = parseFloat(test.test_value);
    
    // Dacă există o etichetă non-numerică, verificăm dacă valoarea este egală cu eticheta
    if (test.reference_range.label) {
      return test.test_value === test.reference_range.label;
    }
    
    // Verificăm dacă valoarea este în intervalul min-max
    const min = test.reference_range.min ? parseFloat(test.reference_range.min) : null;
    const max = test.reference_range.max ? parseFloat(test.reference_range.max) : null;
    
    if (min !== null && max !== null) {
      return value >= min && value <= max;
    } else if (min !== null) {
      return value >= min;
    } else if (max !== null) {
      return value <= max;
    }
    
    return true; // Dacă nu există criterii de comparație, considerăm normal
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="actions-container">
            <button className="action-button" onClick={() => navigate('/all-analyses')}>
              Visualize All 
            </button>
            <button className="action-button" onClick={() => navigate('/upload-analyses')}>
              Add new test results
            </button>
          </div>
        </div>

        <div className="section">
          <h2>Recent Tests</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && recentTests.length === 0 && <p>No recent tests found.</p>}

          {!loading && recentTests.length > 0 && (
            <div className="analysis-cards-container">
              {(showAll ? recentTests : recentTests.slice(0, 3)).map((dayGroup) => {
                const { normalCount, abnormalCount, status } = calculateTestResults(dayGroup.tests);
                return (
                  <DataAnalysesCard
                    key={dayGroup._id}
                    analysis={{
                      collectionDate: dayGroup._id,
                      normalResults: normalCount,
                      abnormalResults: abnormalCount,
                      status: status
                    }}
                    onViewDetails={() => handleDateClick(dayGroup._id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {recentTests.length > 3 && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button className="action-button" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'See All'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
