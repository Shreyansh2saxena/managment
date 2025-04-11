import React, { useState, useEffect } from 'react';
import axios from 'axios';


const LeaveRequestForm = () => {
  // Form state
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState('First Half');
  const [reason, setReason] = useState('');
  const [leavedata, setLeavedata] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  
  // Employee data
  const [employeeData, setEmployeeData] = useState(null);

  // Leave type options
  const leaveTypeOptions = [
    { value: '', label: 'Select Leave Type' },
    { value: 'Sick Leave', label: 'Sick Leave' },
    { value: 'Casual Leave', label: 'Casual Leave' },
    { value: 'Paid Leave', label: 'Paid Leave' },
    { value: 'LOP', label: 'LOP' }
  ];

  // Fetch employee data when ID changes
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    } else {
      setEmployeeName('');
      setEmployeeData(null);
    }
  }, [employeeId]);

  // Fetch employee data
  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/employees/${employeeId}`);
      if (response.data) {
        setEmployeeName(response.data.employeeName || '');
        setEmployeeData(response.data);
        showMessage('', ''); // Clear any previous messages
      } else {
        setEmployeeName('');
        setEmployeeData(null);
        showMessage('Employee not found', 'error');
      }
      setLoading(false);
    } catch (error) {
      setEmployeeName('');
      setEmployeeData(null);
      showMessage('Error fetching employee data', 'error');
      setLoading(false);
    }
  };

  // Show message with type (success/error)
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    // Auto clear message after 5 seconds
    if (msg) {
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const ftable = async ()=>{
    try {
      const res = await axios.get('http://localhost:8081/api/leaves/all');
      setLeavedata(res.data.content)
      console.log("Fetched Leave Data:", res.data);
    }
    catch (error) {
      console.error('Error fetching leave data:', error);
      alert('Error fetching leave data. Please try again later.');
    }
  }

  useEffect(()=>{
    ftable();
  },[])

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!employeeId) {
      showMessage('Please enter employee ID', 'error');
      return;
    }
    
    if (!leaveType) {
      showMessage('Please select leave type', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      const leaveRequest = {
        employeeId: parseInt(employeeId),
        leaveType,
        isHalfDay,
        halfDayType: isHalfDay ? halfDayType : null,
        leaveDate,
        reason
      };
      
      const response = await axios.post('http://localhost:8081/api/leaves/apply', leaveRequest);
      showMessage('Leave request submitted successfully', 'success');
      
      // Reset form after successful submission
      resetForm();
      ftable();
      
      setLoading(false);
    } catch (error) {
      let errorMessage = 'Failed to submit leave request';
      
      // Handle error properly - ensure we're only rendering strings
      if (error.response && typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      showMessage(errorMessage, 'error');
      setLoading(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setLeaveType('');
    setLeaveDate(new Date().toISOString().split('T')[0]);
    setIsHalfDay(false);
    setHalfDayType('First Half');
    setReason('');
    // Keep employee ID and name as they are
  };

  return (
    <div>
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-6">Leave Request</h1>
      
      {/* Message display */}
      {message && (
        <div 
          className={`mb-4 p-3 border rounded ${
            messageType === 'success' 
              ? 'bg-green-100 border-green-400 text-green-700' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Employee ID */}
        <div className="mb-4">
          <label htmlFor="employeeId" className="block text-gray-700 mb-2">
            Employee ID
          </label>
          <input
            type="number"
            id="employeeId"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        
        {/* Employee Name */}
        <div className="mb-4">
          <label htmlFor="employeeName" className="block text-gray-700 mb-2">
            Employee Name
          </label>
          <input
            type="text"
            id="employeeName"
            className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            placeholder="Enter Employee Name"
            value={employeeName}
            readOnly
          />
        </div>
        
        {/* Leave Type */}
        <div className="mb-4">
          <label htmlFor="leaveType" className="block text-gray-700 mb-2">
            Leave Type
          </label>
          <select
            id="leaveType"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            {leaveTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Leave Date */}
        <div className="mb-4">
          <label htmlFor="leaveDate" className="block text-gray-700 mb-2">
            Leave Date
          </label>
          <input
            type="date"
            id="leaveDate"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
          />
        </div>
        
        {/* Half Day Option */}
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isHalfDay"
              className="mr-2"
              checked={isHalfDay}
              onChange={(e) => setIsHalfDay(e.target.checked)}
            />
            <label htmlFor="isHalfDay" className="text-gray-700">
              Apply for Half Day
            </label>
          </div>
          
          {/* Show half day type selection if half day is checked */}
          {isHalfDay && (
            <div className="mt-2 ml-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="firstHalf"
                  name="halfDayType"
                  value="First Half"
                  checked={halfDayType === 'First Half'}
                  onChange={(e) => setHalfDayType(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="firstHalf" className="text-gray-700 mr-4">
                  First Half
                </label>
              </div>
              <div className="flex items-center mt-1">
                <input
                  type="radio"
                  id="secondHalf"
                  name="halfDayType"
                  value="Second Half"
                  checked={halfDayType === 'Second Half'}
                  onChange={(e) => setHalfDayType(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor="secondHalf" className="text-gray-700">
                  Second Half
                </label>
              </div>
            </div>
          )}
        </div>
        
        {/* Reason for Leave */}
        <div className="mb-6">
          <label htmlFor="reason" className="block text-gray-700 mb-2">
            Reason for Leave
          </label>
          <textarea
            id="reason"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows="4"
            placeholder="Please provide a reason for your leave request"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
    <div className="w-full flex jsutify-center mt-10">
      {leavedata.length > 0 ? (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">Employees Leave Info</h3>
        <div className="overflow-x-auto">
            <table className="w-full table-auto border border-gray-300 text-center rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">Employee ID</th>
                        <th className="border px-4 py-2">Employee Name</th>
                        <th className="border px-4 py-2">Leave Type</th>
                        <th className="border px-4 py-2">Leave Date</th>
                        <th className="border px-4 py-2">Half Day</th>
                        <th className="border px-4 py-2">Reason</th>
                    </tr>
                </thead>
                <tbody>
                {leavedata.map((emp, index) => (
            <tr key={emp.id || index} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{emp.employeeId}</td>
              <td className="border px-4 py-2">{emp.leaveType}</td>
              <td className="border px-4 py-2">{emp.leaveDate}</td>
              <td className="border px-4 py-2">{emp.leaveStatus}</td>
              <td className="border px-4 py-2">
                {emp.halfDay
                  ? (emp.halfDayType === 'first' ? 'First Half' : emp.halfDayType === 'second' ? 'Second Half' : 'Half Day')
                  : 'Full Day'}
              </td>
            </tr>
          ))}
                </tbody>
            </table>
        </div>
    </div>
) : (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No leave data available</p>
    </div>
)}
</div>
</div>
               
   
  );
};

export default LeaveRequestForm;