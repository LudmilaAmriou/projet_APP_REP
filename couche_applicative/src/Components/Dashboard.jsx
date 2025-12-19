import React from 'react';

const Dashboard = ({ selectedService, financeData }) => {
  if (!financeData) {
    return (
      <div className="flex justify-center items-center mt-20">
        <p className="text-gray-500 text-lg animate-pulse">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  
      <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-xl font-bold text-blue-700 mb-4">{selectedService}</h2>
        <div className="space-y-2 text-gray-700">
          {Object.entries(financeData).map(([key, value]) => (
            <div key={key} className="border-l-4 border-blue-500 pl-4 py-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
              <p className="font-semibold">{key}</p>
              <pre className="text-sm overflow-auto">{JSON.stringify(value, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default Dashboard;
