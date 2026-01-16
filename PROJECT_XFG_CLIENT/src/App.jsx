import { API_URL } from './config'; // Import it at the top
import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("DISCONNECTED");

  useEffect(() => {
    // Poll the server every 1 second
    const interval = setInterval(() => {
      fetchData();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      // CORRECT URL: We fetch '/stats' to get the graph data
      // CORRECT SYNTAX: No { ... } needed for a simple GET request
      const response = await fetch(`${API_URL}/stats`);
      
      const data = await response.json();
      setData(data);
      setStatus("SYSTEM ONLINE");
    } catch (err) {
      console.error(err);
      setStatus("CONNECTION LOST");
    }
  };
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#0f0', padding: '20px', fontFamily: 'monospace' }}>
      <h1>PROJECT XFG: OMEGA DASHBOARD</h1>
      
      <div style={{ border: '1px solid #333', padding: '10px', marginBottom: '20px' }}>
        STATUS: <span style={{ color: status === 'SYSTEM ONLINE' ? '#0f0' : '#f00' }}>{status}</span> | 
        LOGS DETECTED: {data.length}
      </div>

      <div style={{ height: '400px', width: '100%', border: '1px solid #333' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="timestamp" tick={false} />
            <YAxis domain={[0, 500]} />
            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #0f0' }} />
            <Line type="monotone" dataKey="fitness_score" stroke="#0f0" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>SURVIVOR LOG:</h3>
      {data.slice().reverse().slice(0, 5).map((log) => (
        <div key={log._id} style={{ borderBottom: '1px solid #333', padding: '5px' }}>
          [{log.surviving_variant}] - FITNESS: {log.fitness_score}
        </div>
      ))}
    </div>
  )
}

export default App