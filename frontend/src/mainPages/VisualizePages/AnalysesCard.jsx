import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AnalysesCard.css';

const getStatus = (value, min=null, max=null, label=null) => {
    if (label) {
        label = label.toLowerCase();
        value = value.toLowerCase();
        if(label===value) return 'normal';
        return 'critical';
    }
  const num = parseFloat(value);
  const minNum = parseFloat(min);
  const maxNum = parseFloat(max);

  if (isNaN(minNum)){
    if(num<maxNum)
      return 'normal';
    return 'critical';
  }
  if (isNaN(maxNum)){
    if(num>minNum)
      return 'normal';
    return 'critical';
  }
  const range = maxNum - minNum;
  const lowerBound = minNum + range * 0.1;
  const upperBound = maxNum - range * 0.1;

  if (num < minNum || num > maxNum) return 'critical';
  if (num <= lowerBound || num >= upperBound) return 'warning';
  return 'normal';
};

const AnalysisCard = ({ analysis }) => {
  const navigate = useNavigate();
  const status = getStatus(
    analysis.test_value,
    analysis.reference_range?.min,
    analysis.reference_range?.max,
    analysis.reference_range?.label
  );

  return (
    <div className="card-gradient-wrapper">
    <div className="analysis-card" onClick={() => navigate(`/analyses/${encodeURIComponent(analysis.test_name)}`)}>
      <div className="card-header">
        <div className="card-info">
          <div className={`status-indicator ${status}`}></div>
          <div className="test-details">
            <h3 className="test-name">{analysis.test_name}</h3>
            <p className="last-test">
              {new Date(analysis.test_date).toLocaleDateString('ro-RO')}
            </p>
          </div>
        </div>
      </div>
      <div className="card-content">
        <p className={`status-text ${status}`}>{status.toUpperCase()}</p>
        <p className="test-value">
          {analysis.test_value}
          <span className="test-unit"> {analysis.test_unit}</span>
        </p>
      </div>
    </div>
    </div>
  );
};

export default AnalysisCard;
