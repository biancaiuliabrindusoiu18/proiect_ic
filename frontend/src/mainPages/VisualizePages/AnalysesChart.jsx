// AnalysisChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import './AnalysesChart.css';

const AnalysesChart = ({ data, testName, unit, min, max }) => {
  return (
    <div className="chart-container">
      <h2 className="chart-title">Evoluția testului: {testName}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} unit={unit} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          {min && <ReferenceLine y={parseFloat(min)} stroke="#10b981" strokeDasharray="3 3" label="Min" />}
          {max && <ReferenceLine y={parseFloat(max)} stroke="#ef4444" strokeDasharray="3 3" label="Max" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysesChart;
