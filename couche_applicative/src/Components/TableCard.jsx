import React from 'react';

const TableCard = ({ title, data }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 overflow-auto">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="border px-4 py-2 text-left">Responsable</th>
            <th className="border px-4 py-2 text-left">Marge totale</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border px-4 py-2">{row.responsable}</td>
              <td className="border px-4 py-2">{row.total_marge}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCard;
