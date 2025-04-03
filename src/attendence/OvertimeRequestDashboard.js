import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OvertimeForm = () => {
  // Form state
  const [employeeId, setEmployeeId] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Table state
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterEmployeeName, setFilterEmployeeName] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  // Fetch employee details when ID changes
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails(employeeId);
    } else {
      setEmployeeDetails(null);
    }
  }, [employeeId]);

  // Fetch all overtime records
  useEffect(() => {
    fetchOvertimeRecords();
  }, [page, size]);

  // Apply filters to records
  useEffect(() => {
    applyFilters();
  }, [overtimeRecords, filterEmployeeId, filterEmployeeName]);

  const fetchEmployeeDetails = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8081/api/employees/${id}`);
      setEmployeeDetails(response.data);
    } catch (err) {
      setError('Employee not found. Please check the ID.');
      setEmployeeDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchOvertimeRecords = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/overtime/all?page=${page}&size=${size}`);
      setOvertimeRecords(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching overtime records:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8081/api/overtime/add', null, {
        params: {
          employeeId,
          date,
          hours
        }
      });
      
      setSuccess('Overtime record added successfully!');
      // Reset form
      setDate('');
      setHours('');
      // Refresh records
      fetchOvertimeRecords();
    } catch (err) {
      setError('Failed to add overtime record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...overtimeRecords];
    
    if (filterEmployeeId) {
      filtered = filtered.filter(record => 
        record.employee.id.toString().includes(filterEmployeeId)
      );
    }
    
    if (filterEmployeeName) {
      filtered = filtered.filter(record => 
        record.employee.employeeName.toLowerCase().includes(filterEmployeeName.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Overtime Management</h1>
      
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Overtime Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            {loading && <div className="text-gray-500">Loading employee details...</div>}
            
            {employeeDetails && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={employeeDetails.employeeName || ''}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Email
                  </label>
                  <input
                    type="text"
                    value={employeeDetails.email || ''}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={employeeDetails.role || ''}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                    disabled
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="1"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {success && <div className="mt-4 text-green-500">{success}</div>}
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !employeeDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Overtime'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Records Table Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Overtime Records</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Employee ID
            </label>
            <input
              type="text"
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Employee Name
            </label>
            <input
              type="text"
              value={filterEmployeeName}
              onChange={(e) => setFilterEmployeeName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.employee.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employee.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.hours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        record.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No overtime records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing {page * size + 1} to {Math.min((page + 1) * size, overtimeRecords.length)} of{' '}
              {overtimeRecords.length} results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
              >
                Previous
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeForm;