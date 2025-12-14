import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import financeService from './services/financeService';

const App = () => {
  const services = [
    'Finance & contrôle de gestion',
    'Juridique',
    'Direction Générale',
    'Informatique',
    'Achats',
    'Collecte',
    'Assistance Technique'
  ];

  const [selectedService, setSelectedService] = useState('Finance & contrôle de gestion');
  const [financeData, setFinanceData] = useState(null);

  useEffect(() => {
    if (selectedService === 'Finance & contrôle de gestion') {
      financeService.getOldestDrone().then(data => setFinanceData(data));
    }
  }, [selectedService]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar services={services} selectedService={selectedService} onSelect={setSelectedService} />
      <HomePage selectedService={selectedService} financeData={financeData} />
    </div>
  );
};

export default App;
