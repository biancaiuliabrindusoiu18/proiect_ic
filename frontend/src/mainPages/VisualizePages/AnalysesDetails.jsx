"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import axios from "axios"
import AnalysesChart from "./AnalysesChart"
import "./AnalysesChart.css"

const AnalysesDetails = () => {
  const { testName } = useParams()
  const [data, setData] = useState([])
  const [unit, setUnit] = useState("")
  const [min, setMin] = useState(null)
  const [max, setMax] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [previousTests, setPreviousTests] = useState([])
useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    try {
      const res = await axios.get(
        `http://localhost:5000/api/analyses/by-name/${encodeURIComponent(testName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      console.log("Analyses received:", res.data)

      const formatted = res.data.map((test) => ({
        date: new Date(test.test_date).toLocaleDateString("ro-RO"),
        value: Number.parseFloat(test.test_value),
      }))

      setData(formatted)

      const refMin = res.data[0].reference_range?.min ?? null
      const refMax = res.data[0].reference_range?.max ?? null
      setMin(refMin)
      setMax(refMax)
      setUnit(res.data[0].test_unit)

      const previousTestsData = res.data
        .map((test) => {
          const value = Number.parseFloat(test.test_value)
          const refMin = test.reference_range?.min
          const refMax = test.reference_range?.max

          let status = "Unknown"
          if (refMin != null && refMax != null) {
            status = value < refMin ? "Low" : value > refMax ? "High" : "Normal"
          }

          return {
            value: `${test.test_value} ${test.test_unit}`,
            date: new Date(test.test_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            status: status,
          }
        })
        .reverse()

      setPreviousTests(previousTestsData)
    } catch (err) {
      console.error(err)
      setError("Eroare la încărcarea datelor.")
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [testName])


  if (loading) {
    return (
      <div className="hemoglobin-container">
        <div className="loading-state">Se încarcă...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="hemoglobin-container">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div>
    <div className="main-content">
      <AnalysesChart data={data} testName={testName} unit={unit} min={min} max={max} />
        <button onClick={()=>navigate("/all-analyses")}>Back to all</button>

      {/* Previous Tests Section */}
      
        <div className="previous-tests">
          <h2 className="previous-tests-title">Previous Tests</h2>
          <div>
            {previousTests.map((test, index) => (
              <div key={index} className="test-item">
                <div className="test-item-left">
                  <div className="test-value">{test.value}</div>
                  <div className="test-date">{test.date}</div>
                </div>
                <div className="test-item-right">
                  <span className={`test-status ${test.status.toLowerCase()}`}>{test.status}</span>
                  <span className="chevron-icon">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysesDetails
