import Navbar from "../components/Navbar"
import "./About.css"

function About() {
  return (
    <div>
      <Navbar />
      <div className="about">
        <h2 className="about-title">Smart E-Nose Based Aroma Shelf Life Detection Using Machine Learning</h2>
        <p className="about-sub">How our citrus freshness detection system works</p>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">🔬</div>
            <h3>Gas Sensors</h3>
            <p>Three MQ sensors detect ammonia, methane and ethanol gases released by citrus fruits as they age.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">⚡</div>
            <h3>Arduino</h3>
            <p>Arduino reads sensor values and sends them to the Python backend via serial communication.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">🤖</div>
            <h3>Machine Learning</h3>
            <p>Random Forest model trained on citrus sensor data predicts freshness and remaining shelf life.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">🍊</div>
            <h3>Nagpur Focus</h3>
            <p>Built specifically for Nagpur's orange farmers and consumers to reduce post-harvest fruit loss.</p>
          </div>
        </div>

        <div className="about-flow">
          <h3>System Architecture</h3>
          <div className="flow-steps">
            <div className="flow-step">🍊 Fruit Sample</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">📡 MQ Sensors</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">⚡ Arduino</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">🐍 Flask API</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">🤖 ML Model</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">📊 Dashboard</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About