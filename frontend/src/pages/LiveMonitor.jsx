import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { getLiveData } from "../services/api"
import "./LiveMonitor.css"

function LiveMonitor() {
  const [liveData, setLiveData] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const checkLiveData = () => {
      getLiveData().then(res => {
        setConnected(res.connected)
        if (res.connected) setLiveData(res.data)
      })
    }

    checkLiveData()
    const interval = setInterval(checkLiveData, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
  <div className="live-monitor">
    <Navbar />
    <div className="live-body">
      <div className="live-header">
        <div>
          <h2 className="live-title">Live Monitor</h2>
          <p className="live-sub">Real-time sensor feed from ESP32</p>
        </div>
        <div className={connected ? "live-status connected" : "live-status disconnected"}>
          ● {connected ? "Device Connected" : "Waiting for device..."}
        </div>
      </div>

      {liveData ? (
        <>
          <div className="live-kpi-row">
            <div className="live-kpi-card">
              <p className="live-kpi-label">FRUIT</p>
              <h2>{liveData.fruit}</h2>
            </div>
            <div className="live-kpi-card">
              <p className="live-kpi-label">FRESHNESS</p>
              <h2 style={{ color: liveData.freshness === "Fresh" ? "#588157" : liveData.freshness === "Medium" ? "#f59e0b" : "#dc2626" }}>
                {liveData.freshness}
              </h2>
            </div>
            <div className="live-kpi-card">
              <p className="live-kpi-label">SHELF LIFE</p>
              <h2>{liveData.shelf_life_days} days</h2>
            </div>
          </div>

          <div className="live-sensor-row">
            <div className="live-sensor-card">
              <p className="live-sensor-label">MQ-135 · NH₃</p>
              <h3>{liveData.mq135} ppm</h3>
            </div>
            <div className="live-sensor-card">
              <p className="live-sensor-label">MQ-4 · Methane</p>
              <h3>{liveData.mq4} ppm</h3>
            </div>
            <div className="live-sensor-card">
              <p className="live-sensor-label">MQ-3 · Ethanol</p>
              <h3>{liveData.mq3} ppm</h3>
            </div>
            <div className="live-sensor-card">
              <p className="live-sensor-label">Temperature</p>
              <h3>{liveData.temperature}°C</h3>
            </div>
            <div className="live-sensor-card">
              <p className="live-sensor-label">Humidity</p>
              <h3>{liveData.humidity}%</h3>
            </div>
          </div>

          <p className="live-timestamp">Last updated: {liveData.timestamp}</p>
        </>
      ) : (
        <p className="live-empty">No live data yet. Connect your ESP32 to start streaming readings.</p>
      )}
    </div>
  </div>
)


}

export default LiveMonitor