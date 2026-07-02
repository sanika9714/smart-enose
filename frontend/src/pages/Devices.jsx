import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { getLiveData } from "../services/api"
import "./Devices.css"

const sensorList = [
  { id: "MQ-135", label: "Ammonia & CO₂ Sensor", desc: "Detects ammonia, carbon dioxide, and other harmful gases released during fruit decay.", icon: "🧪" },
  { id: "MQ-4", label: "Methane Sensor", desc: "Detects methane gas produced during bacterial decomposition of organic matter.", icon: "🔥" },
  { id: "MQ-3", label: "Ethanol Sensor", desc: "Detects ethanol vapors released during fermentation — an early spoilage indicator.", icon: "🍷" },
  { id: "DHT22", label: "Temp & Humidity Sensor", desc: "Monitors environmental temperature and humidity which directly affect shelf life.", icon: "🌡️" },
]

function Devices() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    getLiveData().then(res => setConnected(res.connected))
    const interval = setInterval(() => {
      getLiveData().then(res => setConnected(res.connected))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="devices">
      <Navbar />
      <div className="devices-body">
        <h2 className="devices-title">Devices</h2>
        <p className="devices-sub">Hardware sensors connected to your Smart E-Nose system</p>

        <div className="devices-status-banner" style={{ background: connected ? "#d1e8d1" : "#f0ece4" }}>
          <span style={{ color: connected ? "#1a4d2e" : "#99948a", fontWeight: 600 }}>
            {connected ? "● ESP32 Connected — All sensors online" : "● ESP32 Disconnected — Waiting for device..."}
          </span>
        </div>

        <div className="devices-grid">
          {sensorList.map(sensor => (
            <div key={sensor.id} className="device-card">
              <div className="device-card-top">
                <span className="device-icon">{sensor.icon}</span>
                <span className={connected ? "device-badge online" : "device-badge offline"}>
                  {connected ? "Online" : "Offline"}
                </span>
              </div>
              <h3 className="device-id">{sensor.id}</h3>
              <p className="device-label">{sensor.label}</p>
              <p className="device-desc">{sensor.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Devices