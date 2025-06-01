import React from "react";
import { useNavigate } from "react-router-dom";
import "./AnalyseCardByDate.css";

const AnalyseCardByDate = ({ test }) => {
  const { test_name, test_value, test_unit, test_date, reference_range } = test;

  const value = parseFloat(test_value);
  const unit = test_unit || "";
  const min = reference_range?.min !== undefined ? parseFloat(reference_range.min) : null;
  const max = reference_range?.max !== undefined ? parseFloat(reference_range.max) : null;
  const label = reference_range?.label || null;

  const isLabelTest = !!label;
  const originalValue = test_value?.toString()?.toLowerCase();
  const currentDate = new Date(test_date).toLocaleDateString("ro-RO");

  let clampedPosition = 50;
  let isNormal = true;
  let statusText = "No Reference";

  if (isLabelTest) {
    const v = originalValue;
    isNormal = !(v.includes("pozitiv") || v.includes("positive") || v === "+");
    clampedPosition = isNormal ? 25 : 75;
    statusText = isNormal ? "Negativ" : "Pozitiv";
  } else if (min !== null && max !== null && !isNaN(value)) {
    isNormal = value >= min && value <= max;
    clampedPosition = ((value - min) / (max - min)) * 100;
    clampedPosition = Math.max(0, Math.min(100, clampedPosition));
    statusText = isNormal ? "Normal Range" : value < min ? "Low" : "High";
  } else if (min !== null && !isNaN(value)) {
    isNormal = value >= min;
    clampedPosition = isNormal ? 75 : 25;
    statusText = isNormal ? "Normal" : "Low";
  } else if (max !== null && !isNaN(value)) {
    isNormal = value <= max;
    clampedPosition = isNormal ? 25 : 75;
    statusText = isNormal ? "Normal" : "High";
  }

  const navigate = useNavigate();

  return (
    <div className="analysis-by-date-card"onClick={() => navigate(`/analyses/${encodeURIComponent(test_name)}`)}>
      <div className="analysis-by-date-header">
      </div>

      <div className="analysis-by-date-value">
        <div>{test_name}</div>
        <div>
          {test_value} {unit}
        </div>
      </div>

      {/* Label-based (pozitiv/negativ) */}
      {isLabelTest && (
        <div className="analysis-by-date-reference-range">
          <div className="analysis-by-date-range-header">
            <span>Result:</span>
            <span>{statusText}</span>
          </div>
          <div className="analysis-by-date-bar-container label-mode">
            <div
              className="analysis-by-date-bar"
              style={{ backgroundColor: isNormal ? "#10b981" : "#ef4444" }}
            >
              <div className="analysis-by-date-half-bar negative"></div>
              <div className="analysis-by-date-half-bar positive"></div>
            </div>
            <div
              className="analysis-by-date-indicator"
              style={{ left: `${clampedPosition}%` }}
            />
          </div>
        </div>
      )}

      {/* Numeric-based (min/max) */}
      {!isLabelTest && (min !== null || max !== null) && (
        <div className="analysis-by-date-reference-range">
          <div className="analysis-by-date-range-header">
            <span>Reference Range:</span>
            <span>
              {min !== null && max !== null
                ? `${min} - ${max}`
                : min !== null
                ? `≥${min}`
                : `≤${max}`}{" "}
              {unit}
            </span>
          </div>
          <div className="analysis-by-date-bar-container">
            <div
                className="analysis-by-date-bar"
                style={{ backgroundColor: isNormal ? "#10b981" : "#ef4444" }}
              />
            <div
              className="analysis-by-date-indicator"
              style={{
                left: `${clampedPosition}%`,
                backgroundColor: "#000000" ,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyseCardByDate;
