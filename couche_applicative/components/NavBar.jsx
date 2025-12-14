import React from 'react';

const Navbar = ({ services, selectedService, onSelect }) => {
  return (
    <nav className="flex items-center justify-between bg-blue-700 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">Tableau de Bord - Finance</h1>
      <div className="flex space-x-2">
        {services.map(service => (
          <button
            key={service}
            onClick={() => onSelect(service)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              selectedService === service ? 'bg-white text-blue-700' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {service}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
