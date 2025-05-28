"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
  ReferenceArea,
} from "recharts"
import "./AnalysesChart.css"

//custom dot component
const CustomDot = ({ cx, cy, payload, min, max, label }) => {
  const value = payload?.value
  let isNormal = false

  if (label) {
    // Compară valoarea "brută" originală
    const original = payload?.originalValue?.toString().toLowerCase()
    const expected = label.toString().toLowerCase()
    isNormal = original === expected
  } else if (min !== null && max !== null) {
    isNormal = value >= min && value <= max
  } else if (min !== null) {
    isNormal = value >= min
  } else if (max !== null) {
    isNormal = value <= max
  }

  const color = isNormal ? "#10b981" : "#ef4444"

  // Fără punct dacă valoarea e invalidă
  if (value === null || typeof value !== "number" || isNaN(value)) {
    return null
  }

  return <Dot cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} />
}


// Custom Y-axis tick
const CustomYAxisTick = ({ x, y, payload, showValues }) => {
  const value = payload.value
  console.log("Tick value:", value, "| Show if in:", showValues)

  // Verificăm dacă această valoare trebuie afișată
  if (!showValues.includes(value)) {
    return null
  }

  // Pentru min/max ambele sunt bold
  const isBold = showValues.includes(value) 

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#6b7280" fontSize="12" fontWeight={isBold ? "bold" : "normal"}>
        {value}
      </text>
    </g>
  )
}

const AnalysesChart = ({ data, testName, unit, min, max, label }) => {
  const currentValue = data?.[data.length - 1]?.value ?? 0
  const currentDate = data?.[data.length - 1]?.date ?? ""

  // Create extended data for X-axis
  const createExtendedData = () => {
    if (!data || data.length === 0) return []

    const parsedData = data.map((item) => ({
      ...item,
      parsedDate: new Date(item.date.split(".").reverse().join("-")),
    }))

    const sortedData = parsedData.sort((a, b) => a.parsedDate - b.parsedDate)
    const oldestDate = sortedData[0].parsedDate
    const currentDate = new Date()

    const startDate = new Date(oldestDate)
    startDate.setFullYear(startDate.getFullYear() - 2)

    const extendedData = []

    extendedData.push({
      date: startDate.toLocaleDateString("ro-RO"),
      value: null,
      parsedDate: startDate,
      isExtended: true,
    })

    sortedData.forEach((item) => {
      let numericValue = item.value
      if (label) {
        const v = (item.value || "").toString().toLowerCase()
        if (v.includes("pozitiv") || v === "+" || v.includes("positive")) {
            numericValue = 25
        } else if (v.includes("negativ") || v === "-" || v.includes("negative")) {
            numericValue = -25
        } else {
            numericValue = null // <- important: nu forța 0
        }
        }

      extendedData.push({
        ...item,
        value: numericValue,
        originalValue: item.value,
        isExtended: false,
      })
    })

    extendedData.push({
      date: currentDate.toLocaleDateString("ro-RO"),
      value: null,
      parsedDate: currentDate,
      isExtended: true,
    })

    return extendedData
  }

  const extendedData = createExtendedData()

  // Calculez valorile pentru toate cazurile
  let yRefMin, yRefMax, refAreaY1, refAreaY2, showValues
  let isNormal, statusText, statusClass, clampedPosition

  const values = data.map((d) => d.value).filter((v) => v != null && typeof v === "number")
  const minValue = values.length > 0 ? Math.min(...values) : 0
  const maxValue = values.length > 0 ? Math.max(...values) : 0

  if (label) {
    // CAZ LABEL: min = -50, max = 50, pe axă doar 0
    yRefMin = -50
    yRefMax = 50
    showValues = [0] // Doar 0 pe axă

    const numericCurrentValue =
      typeof currentValue === "string"
        ? currentValue.toLowerCase().includes("pozitiv") ||
          currentValue.toLowerCase().includes("positive") ||
          currentValue === "+"
          ? 25
          : -25
        : currentValue

    isNormal = numericCurrentValue > 0
    statusText = isNormal ? "Pozitiv" : "Negativ"
    statusClass = isNormal ? "normal" : "critical"
    clampedPosition = isNormal ? 75 : 25

    // Colorez în funcție de rezultat: pozitiv = 0-50, negativ = -50-0
    if (isNormal) {
      // Pozitiv: colorez 0 → 50
      refAreaY1 = 0
      refAreaY2 = 50
    } else {
      // Negativ: colorez -50 → 0
      refAreaY1 = -50
      refAreaY2 = 0
    }
  } else if (min !== null && max !== null) {
    // CAZ CLASIC: am și min și max
    const range = max - min
    yRefMin = Math.min(minValue, min) - range * 0.5
    yRefMax = Math.max(maxValue, max) + range * 0.5
    refAreaY1 = min
    refAreaY2 = max
    showValues = [Number(min), Number(max)]// AMBELE min și max pe axă - să se afișeze amândouă

    isNormal = currentValue >= min && currentValue <= max
    statusText = isNormal ? "Normal Range" : currentValue < min ? "Low" : "High"
    statusClass = isNormal ? "normal" : currentValue < min ? "low" : "high"
    clampedPosition = ((currentValue - min) / (max - min)) * 100
    clampedPosition = Math.max(0, Math.min(100, clampedPosition))
  } else if (min !== null) {
    // CAZ DOAR MIN: colorez deasupra de min
    yRefMin = Math.min(0, minValue)
    yRefMax = Math.max(maxValue, min * 2)
    refAreaY1 = min
    refAreaY2 = yRefMax
    showValues = [min] // Doar min pe axă

    isNormal = currentValue >= min
    statusText = isNormal ? "Normal" : "Low"
    statusClass = isNormal ? "normal" : "low"
    clampedPosition = isNormal ? 75 : 25
  } else if (max !== null) {
    // CAZ DOAR MAX: colorez sub max
    yRefMin = 0
    yRefMax = max * 2
    refAreaY1 = yRefMin
    refAreaY2 = max
    showValues = [max] // Doar max pe axă

    isNormal = currentValue <= max
    statusText = isNormal ? "Normal" : "High"
    statusClass = isNormal ? "normal" : "high"
    clampedPosition = isNormal ? 25 : 75
  } else {
    // CAZ FĂRĂ REFERINȚE
    const range = maxValue - minValue || 1
    yRefMin = minValue - range * 0.5
    yRefMax = maxValue + range * 0.5
    refAreaY1 = null
    refAreaY2 = null
    showValues = []

    isNormal = true
    statusText = "No Reference"
    statusClass = "normal"
    clampedPosition = 50
  }

  // Create Y-axis ticks - includ toate valorile posibile
  const allTicks = [yRefMin, 0, yRefMax, ...showValues].filter((v) => v >= yRefMin && v <= yRefMax)
  const yTicks = showValues.slice().sort((a, b) => a - b);



  return (
    <div className="hemoglobin-container">
      <div className="main-content">
        <div className="result-card">
          <div className="result-header">
            <div>
              <div className="current-value">{testName}</div>
              <div className="current-value">
                {currentValue} {unit}
              </div>
              {/* <div className="status-indicator">
                <div className="status-dot" style={{ backgroundColor: isNormal ? "#10b981" : "#ef4444" }}></div>
                <span className="status-text" style={{ color: isNormal ? "#10b981" : "#ef4444" }}>
                  {statusText}
                </span>
              </div> */}
            </div>
            <div className="test-info">
              <div>Latest Test</div>
              <div>{currentDate}</div>
            </div>
          </div>

          {/* Reference Range - doar pentru min/max, nu pentru label */}
          {!label && (min !== null || max !== null) && (
            <div className="reference-range">
              <div className="range-header">
                <span>Reference Range:</span>
                <span>
                  {min !== null && max !== null
                    ? `${min}-${max}`
                    : min !== null
                      ? `≥${min}`
                      : max !== null
                        ? `≤${max}`
                        : ""}{" "}
                  {unit}
                </span>
              </div>
              <div className="range-bar-container">
                <div className="range-bar"></div>
                <div className="current-indicator" style={{ left: `${clampedPosition}%`,backgroundColor: isNormal ? "#000000" : "#ef4444" }}></div>
              </div>
            </div>
          )}

          {label && (
            <div className="reference-range">
                <div className="range-header">
                <span>Result:</span>
                <span>{statusText}</span>
                </div>
                <div className="range-bar-container label-mode">
                <div className="range-bar">
                    <div className="half-bar negative"></div>
                    <div className="half-bar positive"></div>
                </div>
                <div
                    className="current-indicator"
                    style={{
                    left: isNormal ? "75%" : "25%",
                    backgroundColor: "#000000",
                    }}
                />
                </div>
            </div>
            )}
        { !label &&(
            <>
          {/* Chart */}
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={extendedData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

                {/* Reference area pentru zona verde - doar dacă avem referințe */}
                {refAreaY1 !== null && refAreaY2 !== null && (
                  <ReferenceArea
                    y1={refAreaY1}
                    y2={refAreaY2}
                    fill="#10b981"
                    fillOpacity={0.15}
                    stroke="#10b981"
                    strokeOpacity={0.3}
                    strokeWidth={1}
                    strokeDasharray="2 2"
                  />
                )}

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={(props) => <CustomYAxisTick {...props} showValues={showValues} />}
                  domain={[yRefMin, yRefMax]}
                  ticks={yTicks}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value, name, props) => {
                    if (value === null) return [null, null]
                    const displayValue =
                      label && props.payload?.originalValue ? props.payload.originalValue : `${value} ${unit}`
                    return [displayValue]
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#374151"
                  strokeWidth={2}
                  connectNulls={false}
                  dot={(props) => {
                    if (props.payload?.value === null) return null
                    const { key, ...rest } = props
                    return <CustomDot key={key} {...rest} min={min} max={max} label={label} />
                  }}
                  activeDot={{ r: 6, fill: "#374151" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </>)}
        </div>
      </div>
    </div>
  )
}

export default AnalysesChart
