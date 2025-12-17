import React, { useEffect, useState } from 'react';
import GraphCard from './GraphCard';
// import TableCard from './TableCard';
import { fetchData } from '../helpers/endpoints'; 

const Dashboard = ({ service }) => {
  const [data, setData] = useState({}); // Dynamic storage for any service

  useEffect(() => {
    const getData = async () => {
      try {
        // For now, fetch Finance / Brazil only
        if (service === "Finance & contrôle de gestion") {
          const res = await fetchData(service, "C", "brazil"); // C = marges_par_responsable
          setData(res);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getData();
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
