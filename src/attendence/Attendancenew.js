import React, { useState, useEffect } from 'react';
import axiosInstance from '../util/axiosInstance';

const AttendanceManagement = () => {
  // Employee data state
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  
  // Attendance records state
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Employee data fetch
  const fetchEmployeeData = async () => {
    if (!employeeId) {
      clearEmployeeData();
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/employees/${employeeId}`);
      if (response.data) {
        setEmployeeName(response.data.employeeName || '');
        setEmployeeEmail(response.data.email || '');
        setMessage('');
      } else {
        clearEmployeeData();
        showMessage('Employee not found', 'error');
      }
      setLoading(false);
    } catch (error) {
      clearEmployeeData();
      showMessage('Error fetching employee data', 'error');
      setLoading(false);
    }
  };

  const clearEmployeeData = () => {
    setEmployeeName('');
    setEmployeeEmail('');
  };

  // Show message with type (success/error)
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    // Auto clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // Handle employee ID change
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  // Fetch attendance records based on filters
  const fetchAttendanceRecords = async () => {
    if (!employeeId || !selectedYear || !selectedMonth) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `api/attendance/logs/${employeeId}/${selectedYear}/${selectedMonth}?page=${currentPage}&size=10`
      );
      setAttendanceRecords(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      showMessage('Error fetching attendance records', 'error');
      setLoading(false);
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    if (!employeeId) {
      showMessage('Please enter employee ID', 'error');
      return;
    }
  
    try {
      setLoading(true);
      // Check if employee already checked in today
      const today = new Date().toISOString().split('T')[0];
      const existingRecord = attendanceRecords.find(
        (record) => record.date === today && record.checkInTime
      );
  
      if (existingRecord) {
        showMessage('Check-in already recorded for today', 'error');
        setLoading(false);
        return;
      }
  
      const response = await axiosInstance.post(`/attendance/checkin/${employeeId}`);
      showMessage(response.data, 'success');
      fetchAttendanceRecords(); // Refresh records
      setLoading(false);
    } catch (error) {
      showMessage('Check-in failed', 'error');
      setLoading(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    if (!employeeId) {
      showMessage('Please enter employee ID', 'error');
      return;
    }
  
    try {
      setLoading(true);
      // Check if employee already checked out today
      const today = new Date().toISOString().split('T')[0];
      const existingRecord = attendanceRecords.find(
        (record) => record.date === today && record.checkOutTime
      );
  
      if (existingRecord) {
        showMessage('Check-out already recorded for today', 'error');
        setLoading(false);
        return;
      }
  
      const response = await axiosInstance.post(`/attendance/checkout/${employeeId}`);
      showMessage(response.data, 'success');
      fetchAttendanceRecords(); // Refresh records
      setLoading(false);
    } catch (error) {
      showMessage('Check-out failed', 'error');
      setLoading(false);
    }
  };

  // Load employee data when ID changes
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    } else {
      clearEmployeeData();
    }
  }, [employeeId]);

  // Load attendance records when filters or page changes
  useEffect(() => {
    if (employeeId) {
      fetchAttendanceRecords();
    }
  }, [employeeId, selectedYear, selectedMonth, currentPage]);

  // Generate year options (5 years back and forward)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Generate month options
  const monthOptions = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Attendance Management System</h1>
      
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
      
      {/* Employee Information Section */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-4">Employee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Employee ID *
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={employeeId}
              onChange={handleEmployeeIdChange}
              placeholder="Enter Employee ID"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Employee Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              value={employeeName}
              readOnly
              placeholder="Auto-filled"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Employee Email
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              value={employeeEmail}
              readOnly
              placeholder="Auto-filled"
            />
          </div>
        </div>
        
        {/* Check-in/Check-out Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleCheckIn}
            disabled={loading || !employeeId}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none disabled:opacity-50"
          >
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={loading || !employeeId}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none disabled:opacity-50"
          >
            Check Out
          </button>
        </div>
      </div>
      
      {/* Attendance Records Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Attendance Records</h2>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1">Year</label>
              <select
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(parseInt(e.target.value));
                  setCurrentPage(0); // Reset to first page on filter change
                }}
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm mb-1">Month</label>
              <select
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(parseInt(e.target.value));
                  setCurrentPage(0); // Reset to first page on filter change
                }}
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>{month.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading && <p className="text-center py-4">Loading...</p>}
        
        {!loading && attendanceRecords.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            No attendance records found for the selected filters.
          </p>
        )}
        
        {!loading && attendanceRecords.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Date</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Employee ID</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Employee Name</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Check-In Time</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Check-Out Time</th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="py-2 px-4 border-b border-gray-200">{record.date}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{record.employee.id}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{record.employee.employeeName}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{formatTime(record.checkInTime)}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{formatTime(record.checkOutTime)}</td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'Checked-out'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || totalPages === 0}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;