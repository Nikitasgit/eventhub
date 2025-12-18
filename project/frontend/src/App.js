import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

function App() {
  const [data, setData] = useState({ message: "", databases: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/`);
        setData(response.data);
      } catch (err) {
        setData({ message: "Connection error", databases: {} });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>EventHub</h1>
      <p>{data.message}</p>

      <div className="databases">
        {Object.entries(data.databases).map(([name, status]) => (
          <div key={name} className={`db ${status}`}>
            <span className="name">{name}</span>
            <span className="status">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
