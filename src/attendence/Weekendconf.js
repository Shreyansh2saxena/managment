import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const WeekendSelector = () => {
  const daysOfWeek = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  ];
  
  const [selectedDays, setSelectedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    fetchWeekends();
  }, []);

  const fetchWeekends = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8081/api/weekends');
      if (response.ok) {
        const data = await response.json();
        setSelectedDays(data);
      } else {
        setMessageType('error');
        setMessage('Failed to fetch current weekend configuration');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const saveWeekends = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8081/api/weekends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedDays)
      });
      
      if (response.ok) {
        setMessageType('success');
        setMessage('Weekend configuration saved successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessageType('error');
        setMessage('Failed to save weekend configuration');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200 mt-10 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Weekend Configuration</h2>
      
      <p className="text-sm text-gray-600 mb-4 text-center">Select days to mark as weekends:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {daysOfWeek.map(day => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`relative px-4 py-2 rounded-lg font-medium text-sm text-center transition-all duration-200 w-full
              ${selectedDays.includes(day) 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {day.charAt(0) + day.slice(1).toLowerCase()}
            {selectedDays.includes(day) && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-md">
                <Check size={12} />
              </span>
            )}
          </button>
        ))}
      </div>
      
      <button
        onClick={saveWeekends}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 shadow-md transition-colors duration-200 font-medium"
      >
        {isLoading ? 'Saving...' : 'Save Configuration'}
      </button>
      
      {message && (
        <div className={`mt-4 py-3 px-4 rounded-lg text-center text-sm font-medium border
          ${messageType === 'error' 
            ? 'bg-red-100 text-red-700 border-red-300' 
            : 'bg-green-100 text-green-700 border-green-300'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default WeekendSelector;
