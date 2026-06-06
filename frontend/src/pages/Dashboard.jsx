import { useState } from "react"
import Navbar from "../components/Navbar"
import { predictFreshness } from "../services/api"
import "./Dashboard.css"

function Dashboard() {
  const [fruit, setFruit] = useState("Orange")
  const [sensors, setSensors] = useState({ mq135: "", mq4: "", mq3: "", temperature: "", humidity: "" })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    setLoading(true)
    try {
      const data = await predictFreshness({
        mq135: parseFloat(sensors.mq135),
        mq4: parseFloat(sensors.mq4),
        mq3: parseFloat(sensors.mq3),
        temperature: parseFloat(sensors.temperature),
        humidity: parseFloat(sensors.humidity),
        fruit: fruit
      })
      setResult(data)
    } catch (error) {
      alert("Error connecting to backend. Make sure Flask is running!")
    }
    setLoading(false)
  }

  const getBarWidth = (value, max) => {
    return Math.min((value / max) * 100, 100)
  }

  const getFreshnessColor = (freshness) => {
    if (freshness === "Fresh") return "#1a4d2e"
    if (freshness === "Medium") return "#f59e0b"
    return "#dc2626"
  }

  const getFreshnessPercent = (freshness) => {
    if (freshness === "Fresh") return 90
    if (freshness === "Medium") return 50
    return 15
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h2 className="dashboard-title">Freshness Detection Dashboard</h2>
        <p className="dashboard-sub">Enter sensor readings to check citrus fruit freshness</p>

        <div className="dashboard-grid">
          <div className="card">
            <h3>Select Fruit</h3>
            <div className="fruit-selector">
              <button
                className={fruit === "Orange" ? "fruit-btn active" : "fruit-btn"}
                onClick={() => setFruit("Orange")}>
                🍊 Orange
              </button>
              <button
                className={fruit === "Lemon" ? "fruit-btn active" : "fruit-btn"}
                onClick={() => setFruit("Lemon")}>
                🍋 Lemon
              </button>
            </div>

            <h3 style={{ marginTop: "24px" }}>Sensor Values</h3>
            <div className="input-group">
              <label>MQ135 - Ammonia / CO2</label>
              <input
                type="number"
                placeholder="e.g. 280"
                value={sensors.mq135}
                onChange={(e) => setSensors({ ...sensors, mq135: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>MQ4 - Methane</label>
              <input
                type="number"
                placeholder="e.g. 150"
                value={sensors.mq4}
                onChange={(e) => setSensors({ ...sensors, mq4: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>MQ3 - Ethanol</label>
              <input
                type="number"
                placeholder="e.g. 220"
                value={sensors.mq3}
                onChange={(e) => setSensors({ ...sensors, mq3: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Temperature (°C)</label>
              <input
                type="number"
                placeholder="e.g. 25"
                value={sensors.temperature}
                onChange={(e) => setSensors({ ...sensors, temperature: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Humidity (%)</label>
              <input
                type="number"
                placeholder="e.g. 60"
                value={sensors.humidity}
                onChange={(e) => setSensors({ ...sensors, humidity: e.target.value })}
              />
            </div>

            <button className="predict-btn" onClick={handlePredict} disabled={loading}>
              {loading ? "Analyzing..." : "Check Freshness"}
            </button>
          </div>

          <div className="card">
            <h3>Chemical Levels</h3>
            <div className="sensor-bars">
              <div className="bar-item">
                <div className="bar-label">
                  <span>MQ135 - Ammonia/CO2</span>
                  <span>{sensors.mq135 || 0} ppm</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill mq135" style={{ width: `${getBarWidth(sensors.mq135, 400)}%` }}></div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">
                  <span>MQ4 - Methane</span>
                  <span>{sensors.mq4 || 0} ppm</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill mq4" style={{ width: `${getBarWidth(sensors.mq4, 350)}%` }}></div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">
                  <span>MQ3 - Ethanol</span>
                  <span>{sensors.mq3 || 0} ppm</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill mq3" style={{ width: `${getBarWidth(sensors.mq3, 380)}%` }}></div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">
                  <span>Temperature</span>
                  <span>{sensors.temperature || 0} °C</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill temp" style={{ width: `${getBarWidth(sensors.temperature, 45)}%` }}></div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">
                  <span>Humidity</span>
                  <span>{sensors.humidity || 0} %</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill humidity" style={{ width: `${getBarWidth(sensors.humidity, 100)}%` }}></div>
                </div>
              </div>
            </div>

            {result && (
              <div className="result-card">
                <h3>Freshness Level</h3>
                <div className="bar-track" style={{ marginTop: "12px" }}>
                  <div className="bar-fill" style={{
                    width: `${getFreshnessPercent(result.freshness)}%`,
                    backgroundColor: getFreshnessColor(result.freshness)
                  }}></div>
                </div>
                <div className="result-status" style={{ color: getFreshnessColor(result.freshness) }}>
                  {result.freshness === "Fresh" ? "🟢" : result.freshness === "Medium" ? "🟡" : "🔴"} {result.freshness}
                </div>
                <p className="result-shelf">Shelf Life: <strong>{result.shelf_life_days} Days</strong></p>
                <p className="result-advice">{result.advice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard