import { useState, useEffect } from 'react';
import Navbar from './Components/NavBar';
import Dashboard from './Components/Dashboard';
import financeService from './Services/FinanceService';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedService === 'Finance & contrôle de gestion') {
      setLoading(true);
      financeService.getOldestDrone()
        .then(data => {
          setFinanceData(data);
          console.log('Fetched data:', data);
        })
        .catch(err => console.error('Error fetching data:', err))
        .finally(() => setLoading(false));
    } else {
      setFinanceData(null); // reset data for other services
    }
  }, [selectedService]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        services={services}
        selectedService={selectedService}
        onSelect={setSelectedService}
      />

      <main className="max-w-7xl mx-auto p-6">
        {loading && (
          <p className="text-center text-gray-500 text-lg animate-pulse mt-10">
            Chargement des données...
          </p>
        )}

        {!loading && selectedService === 'Finance & contrôle de gestion' && financeData && (
          <Dashboard selectedService={selectedService} financeData={financeData} />
        )}

        {!loading && selectedService !== 'Finance & contrôle de gestion' && (
          <p className="text-center text-gray-500 text-lg mt-10">
            Données pour {selectedService} non encore disponibles.
          </p>
        )}
      </main>
    </div>
  );
};

export default App;
