"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from "recharts"
import "./AnalysesChart.css"

// Custom dot component
const CustomDot = ({ cx, cy, payload, min, max }) => {
  const value = payload?.value
  const isHigh = value > max
  const isLow = value < min

  let color = "#10b981" // verde (normal)
  if (isHigh || isLow) color = "#ef4444" // roșu (anormal)

  return <Dot cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} />
}

// Custom Y-axis tick
const CustomYAxisTick = ({ x, y, payload, min, max }) => {
  const value = payload.value
  const isBold = value === min || value === max

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="#6b7280"
        fontSize="12"
        fontWeight={isBold ? "bold" : "normal"}
      >
        {value}
      </text>
    </g>
  )
}

const AnalysesChart = ({ data, testName, unit, min, max }) => {
  const currentValue = data?.[data.length - 1]?.value ?? 0
  const currentDate = data?.[data.length - 1]?.date ?? ""

  const isNormal = currentValue >= min && currentValue <= max
  const statusText = isNormal ? "Normal Range" : currentValue < min ? "Low" : "High"
  const statusClass = isNormal ? "normal" : currentValue < min ? "low" : "high"

  // Referință vizuală pe bară
  const indicatorPosition = ((currentValue - min) / (max - min)) * 100
  const clampedPosition = Math.max(0, Math.min(100, indicatorPosition))

  // Dinamic: determinăm domeniul Y real
  const values = data.map((d) => d.value)
  const actualMin = Math.min(...values, min)
  const actualMax = Math.max(...values, max)
  const range = actualMax - actualMin
  const padding = range * 0.2

  const yMin = actualMin - padding
  const yMax = actualMax + padding

  const yTicks = [...new Set([yMin, min, 0, max, yMax].filter(v => v >= yMin && v <= yMax))]

  return (
    <div className="hemoglobin-container">
      <div className="main-content">
        <div className="result-card">
          <div className="result-header">
            <div>
                <div className="current-value">
                {testName}
                </div>
              <div className="current-value">
                {currentValue} {unit}
              </div>
              <div className="status-indicator">
                <div
                  className="status-dot"
                  style={{ backgroundColor: isNormal ? "#10b981" : "#ef4444" }}
                ></div>
                <span
                  className="status-text"
                  style={{ color: isNormal ? "#10b981" : "#ef4444" }}
                >
                  {statusText}
                </span>
              </div>
            </div>
            <div className="test-info">
              <div>Latest Test</div>
              <div>{currentDate}</div>
            </div>
          </div>

          {/* Reference Range */}
          <div className="reference-range">
            <div className="range-header">
              <span>Reference Range:</span>
              <span>{min}-{max}{unit}</span>
            </div>
            <div className="range-bar-container">
              <div className="range-bar"></div>
              <div className="current-indicator" style={{ left: `${clampedPosition}%` }}></div>
            </div>
          </div>

          {/* Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={(props) => <CustomYAxisTick {...props} min={min} max={max} />}
                  domain={[yMin, yMax]}
                  ticks={yTicks}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value) => [`${value} ${unit}`, testName]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#374151"
                  strokeWidth={2}
                  dot={(props) => <CustomDot {...props} min={min} max={max} />}
                  activeDot={{ r: 6, fill: "#374151" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysesChart
