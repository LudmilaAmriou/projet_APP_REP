import React from 'react';

const Navbar = ({ services, selectedService, onSelect }) => {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <h1 className="text-2xl md:text-xl font-bold mb-2 md:mb-0">Tableau de Bord -  Brazil</h1>
      
      <div className="flex flex-wrap gap-2">
        {services.map(service => (
          <button
            key={service}
            onClick={() => onSelect(service)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 
              ${selectedService === service 
                ? 'bg-white text-blue-800 shadow-lg' 
                : 'bg-blue-500 hover:bg-blue-400 hover:scale-105'}`
            }
          >
            {service}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
