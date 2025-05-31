"use client"
import "./DataAnalysesCard.css"

const DataAnalysesCard = ({ analysis, onViewDetails }) => {
  const {  collectionDate,   normalResults, abnormalResults, status } =
    analysis

  const totalResults = normalResults + abnormalResults

  return (
    <div className="data-analysis-card">
      <div className="data-card-header">
        <h3 className="data-card-title">Analyses {collectionDate}</h3>
      </div>

      <div className="results-status">
        <span className="status-label">RESULTS</span>
        <span className="status-value">{status}</span>
      </div>

      <div className="results-container">
         
          <div className="result-item normal">
            <span className="result-count">{normalResults}</span>
            <span className="result-label">normal values</span>
          </div>
        

         
          <div className="result-item abnormal">
            <span className="result-count">{abnormalResults}</span>
            <span className="result-label">abnormal values</span>
          </div>
        
        
      </div>

      <div className="card-actions">
        <button className="action-btn primary" onClick={() => onViewDetails(analysis)}>
          See all results
        </button>
      </div>
    </div>
  )
}

export default DataAnalysesCard
