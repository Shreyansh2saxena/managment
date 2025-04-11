import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceRequestPage = () => {
  // Form states
  const [employeeId, setEmployeeId] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [date, setDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Table states
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterEmployeeName, setFilterEmployeeName] = useState('');

  // Fetch employee details when ID changes
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails(employeeId);
    } else {
      setEmployeeDetails(null);
    }
  }, [employeeId]);

  // Fetch attendance requests
  useEffect(() => {
    fetchAttendanceRequests();
  }, [page, size, filterEmployeeId, filterEmployeeName]);

  const fetchEmployeeDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/employees/${id}`);
      setEmployeeDetails(response.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setEmployeeDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRequests = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:8081/api/attendance-requests/all?page=${page}&size=${size}`;

      if (filterEmployeeId) {
        url = `http://localhost:8081/api/attendance-requests/employee/${filterEmployeeId}?page=${page}&size=${size}`;
      }

      const response = await axios.get(url);
      setAttendanceRequests(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching attendance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      setLoading(true);

      console.log('Submitting request with data:', {
        employeeId,
        date,
        requestedTime,
      });

      await axios.post(
        `http://localhost:8081/api/attendance-requests/create`,
        null,
        {
          params: {
            employeeId,
            date,
            requestedTime,
          },
        }
      );

      setMessage('Attendance request submitted successfully');
      resetForm();
      fetchAttendanceRequests();
    } catch (error) {
      console.error('Error submitting attendance request:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmployeeId('');
    setDate('');
    setRequestedTime('');
    setMessage('');
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Attendance Request Management</h1>
      
      {/* Request Form */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Submit Attendance Request</h2>
        
        {message && (
          <div className="p-3 mb-4 rounded bg-green-100 text-green-800">
            {message}
          </div>
        )}
        
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Employee ID*</label>
              <input 
                type="text" 
                value={employeeId} 
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter Employee ID"
              />
            </div>
            
            {employeeDetails && (
              <>
                <div>
                  <label className="block mb-1">Employee Name</label>
                  <input 
                    type="text" 
                    value={employeeDetails.employeeName || ''}
                    className="w-full p-2 border rounded bg-gray-50"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Employee Email</label>
                  <input 
                    type="text" 
                    value={employeeDetails.email || ''} 
                    className="w-full p-2 border rounded bg-gray-50"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Employee Role</label>
                  <input 
                    type="text" 
                    value={employeeDetails.role || ''} 
                    className="w-full p-2 border rounded bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block mb-1">Employee Address</label>
                  <input 
                    type="text" 
                    value={employeeDetails.address || ''} 
                    className="w-full p-2 border rounded bg-gray-50"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={employeeDetails.phone || ''} 
                    className="w-full p-2 border rounded bg-gray-50"
                    readOnly
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block mb-1">Date* (YYYY-MM-DD)</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <small className="text-gray-500">Format: YYYY-MM-DD</small>
            </div>
            
            <div>
              <label className="block mb-1">Requested Check-out Time* (HH:MM)</label>
              <input 
                type="time" 
                value={requestedTime} 
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <small className="text-gray-500">Format: HH:MM (24-hour)</small>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
           
          </div>
        </form>
      </div>
      
      {/* Attendance Requests Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Attendance Requests</h2>
        
        {/* Filter controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block mb-1">Filter by Employee ID</label>
            <input 
              type="text" 
              value={filterEmployeeId} 
              onChange={(e) => setFilterEmployeeId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Employee ID"
            />
          </div>
          
          <div>
            <label className="block mb-1">Filter by Employee Name</label>
            <input 
              type="text" 
              value={filterEmployeeName} 
              onChange={(e) => setFilterEmployeeName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Employee Name"
            />
          </div>
          
         
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Request ID</th>
                <th className="p-2 border">Employee ID</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Requested Time</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">action</th>

                <th className="p-2 border">Admin Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRequests.length > 0 ? (
                attendanceRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{request.id}</td>
                    <td className="p-2 border">{request.employeeId}</td>
                    <td className="p-2 border">{request.date}</td>
                    <td className="p-2 border">{request.requestedCheckOutTime}</td>
                    <td td className="p-2 border">
                      <span>
                        <button onClick={happ} className="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 mr-2">Approve</button>
                        <button onClick={hrej} className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-600">Reject</button>
                        </span> 

                    </td>
                    <td className="p-2 border">
                      <span 
                        className={`px-2 py-1 rounded text-xs ${
                          request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          request.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-2 border">{request.adminRemarks || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">No attendance requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
       
            <div className= 'mt-4 flex items-center justify-between'>
              <button 
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 bg-blue-500 border rounded mr-2 disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page + 1} of {totalPages}</span>
              <button 
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 bg-blue-500 border rounded ml-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        
      </div>
  
  );
};

export default AttendanceRequestPage;