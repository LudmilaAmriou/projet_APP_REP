import React, { useEffect, useState } from 'react';
import GraphCard from './GraphCard';
import TableCard from './TableCard';
import apiService from '../services/apiService';

const Dashboard = ({ service }) => {
  const [data, setData] = useState({}); // Dynamic storage for any service

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiService.getServiceData(service);
        setData(res); // backend should return JSON with A/B/C/D endpoints
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [service]);

  if (!data || Object.keys(data).length === 0)
    return <p className="text-center mt-10 text-gray-500">Chargement des données...</p>;

  // Example rendering: adapt keys dynamically
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(data).map(([key, value]) => {
        if (Array.isArray(value))
          return <GraphCard key={key} title={key} data={value} />;
        return (
          <div key={key} className="bg-white shadow-lg rounded-lg p-4 h-80">
            <h3 className="text-lg font-semibold mb-2">{key}</h3>
            <pre className="text-sm overflow-auto">{JSON.stringify(value, null, 2)}</pre>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
