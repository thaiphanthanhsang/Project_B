import React from 'react';
import './DashboardFilters.css';

const DashboardFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDatePreset = (days) => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      
      setFilters(prev => ({
          ...prev,
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0]
      }));
  };

  return (
    <div className="dashboard-filters">
      <div className="filter-group">
        <label>Date Range:</label>
        <div className="date-presets">
          <button onClick={() => handleDatePreset(7)}>Last 7 Days</button>
          <button onClick={() => handleDatePreset(30)}>Last 30 Days</button>
          <button onClick={() => handleDatePreset(365)}>This Year</button>
        </div>
        <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleChange} 
        />
        <span>to</span>
        <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleChange} 
        />
      </div>

      {/* Placeholder for future Category/Status filters if backend supports precise filtering */}
    </div>
  );
};

export default DashboardFilters;
