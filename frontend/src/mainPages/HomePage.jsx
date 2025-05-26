import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const Home = () => {
  const navigate = useNavigate();
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    navigate('/tests-by-date', { state: { date } });
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="section">
          <h2>Quick Actions</h2>
          <div className="actions-container">
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
            <ul className="recent-tests-list">
              {recentTests.map((dayGroup) => (
                <li key={dayGroup._id} className="test-date-group">
                  <button
                    className="date-button"
                    onClick={() => handleDateClick(dayGroup._id)}
                  >
                    {dayGroup._id} ({dayGroup.tests.length} test{dayGroup.tests.length > 1 ? 's' : ''})
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="history-section">
          <button className="action-button" onClick={() => navigate('/nothing')}>
            View full history
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
