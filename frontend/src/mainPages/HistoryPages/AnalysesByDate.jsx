  import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AnalysesByDate.css';
import AnalyseCardByDate from './AnalyseCardByDate'; // componenta ta cu bara

const AnalysesByDate = () => {
  const { date } = useParams(); 
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/analyses/by-date/${date}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(res.data);
      } catch (err) {
        console.error('Error fetching analyses by date:', err);
      } finally {
        setLoading(false);
      }
    };

    if (date) fetchAnalyses();
  }, [date]);

  return (
    <div className="analyses-by-date-container">
      <h2>Analyses from {date}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : tests.length === 0 ? (
        <p>No analyses found for this date.</p>
      ) : (
        <div className="analysis-list">
          {tests.map((test) => (
            <AnalyseCardByDate key={test._id} test={test} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysesByDate;
