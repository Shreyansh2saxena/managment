import React, { useState, useEffect } from 'react';
import axios from 'axios';

const POHRequestForm = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeData, setEmployeeData] = useState(null);
  const [date, setDate] = useState('');
  const [pohRequests, setPohRequests] = useState([]);
  const [allPohRequests, setAllPohRequests] = useState([]); // Store all fetched requests
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('id'); // 'id' or 'name'
  const [isSearchMode, setIsSearchMode] = useState(false);

  
  useEffect(() => {
    fetchAllPOHRequests();
  }, []);

  // Fetch paginated POH requests when page changes (only if not in search mode)
  useEffect(() => {
    if (!isSearchMode) {
      fetchPaginatedPOHRequests();
    }
  }, [currentPage, isSearchMode]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId) {
        setEmployeeData(null);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8081/api/employees/${employeeId}`);
        setEmployeeData(response.data);
      } catch (error) {
        setEmployeeData(null);
        setMessage('Employee not found or error fetching employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [employeeId]);

  const fetchAllPOHRequests = async () => {
    try {
      setLoading(true);
      // Fetch a large batch of records to use for searching
      const response = await axios.get(`http://localhost:8081/api/poh/all?page=0&size=1000`);
      setAllPohRequests(response.data.content);
      
      // If not in search mode, set the current page data
      if (!isSearchMode) {
        setPohRequests(response.data.content.slice(0, 10));
        setTotalPages(Math.ceil(response.data.content.length / 10));
      }
    } catch (error) {
      console.error('Error fetching all POH requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaginatedPOHRequests = async () => {
    if (isSearchMode) return; // Skip if in search mode
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/poh/all?page=${currentPage}&size=10`);
      setPohRequests(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching paginated POH requests:', error);
      setPohRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setIsSearchMode(false);
      fetchPaginatedPOHRequests();
      return;
    }
    
    setLoading(true);
    setIsSearchMode(true);
    
    // Client-side filtering with allPohRequests
    let filteredResults;
    
    if (searchType === 'id') {
      filteredResults = allPohRequests.filter(req => 
        req.id && req.id.toString().includes(searchTerm.trim())
      );
    } else {
      filteredResults = allPohRequests.filter(req => 
        req.employee && 
        req.employee.employeeName && 
        req.employee.employeeName.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }
    
    // Display all search results at once without pagination
    setPohRequests(filteredResults);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !date) {
      setMessage('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      await axios.post('http://localhost:8081/api/poh/save', null, { params: { employeeId, date } });
      setMessage('POH request submitted successfully');
      setDate('');
      
      // Refresh all data after submission
      fetchAllPOHRequests();
      
      if (!isSearchMode) {
        fetchPaginatedPOHRequests();
      } else if (searchTerm) {
        // Re-run search to update results
        handleSearch();
      }
    } catch (error) {
      setMessage('Error submitting POH request');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8081/api/poh/${id}/approve`);
      
      // Refresh data after approval
      fetchAllPOHRequests();
      
      if (!isSearchMode) {
        fetchPaginatedPOHRequests();
      } else if (searchTerm) {
        // Re-run search to update results
        handleSearch();
      }
    } catch (error) {
      console.error('Error approving POH request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8081/api/poh/${id}/reject`);
      
      // Refresh data after rejection
      fetchAllPOHRequests();
      
      if (!isSearchMode) {
        fetchPaginatedPOHRequests();
      } else if (searchTerm) {
        // Re-run search to update results
        handleSearch();
      }
    } catch (error) {
      console.error('Error rejecting POH request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearchMode(false);
    fetchPaginatedPOHRequests();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Present On Holiday (POH) Request Form</h1>
      {message && <div className={`mb-4 p-3 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} border rounded`}>{message}</div>}
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" className="p-2 border rounded" value={employeeId} onChange={(e) => setEmployeeId(e.target.value.trim())} placeholder="Employee ID *" required />
          <input type="text" className="p-2 border rounded bg-gray-100" value={employeeData?.employeeName || ''} readOnly placeholder="Employee Name" />
          <input type="text" className="p-2 border rounded bg-gray-100" value={employeeData?.email || ''} readOnly placeholder="Email" />
          <input type="text" className="p-2 border rounded bg-gray-100" value={employeeData?.role || ''} readOnly placeholder="Role" />
          <input type="date" className="p-2 border rounded" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{loading ? 'Submitting...' : 'Submit POH Request'}</button>
      </form>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">POH Requests History</h2>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <select 
            className="p-2 border rounded" 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="id">Search by ID</option>
            <option value="name">Search by Name</option>
          </select>
          <input 
            type="text" 
            className="p-2 border rounded flex-grow" 
            placeholder={searchType === 'id' ? "Enter ID to search..." : "Enter name to search..."}
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          <button 
            onClick={handleClearSearch} 
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
        {isSearchMode && (
          <p className="text-blue-600 mb-2">
            Showing {pohRequests.length} search results for {searchType === 'id' ? "ID" : "name"}: "{searchTerm}"
          </p>
        )}
      </div>
      
      {loading ? <p>Loading...</p> : pohRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Employee</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pohRequests.map((poh) => (
                <tr key={poh.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{poh.id}</td>
                  <td className="px-4 py-2 border">{poh.employee?.employeeName || '-'}</td>
                  <td className="px-4 py-2 border">{poh.date}</td>
                  <td className={`px-4 py-2 border font-medium ${
                    poh.status === 'Approved' ? 'text-green-600' : 
                    poh.status === 'Rejected' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {poh.status}
                  </td>
                  <td className="px-4 py-2 border">
                    {poh.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleApprove(poh.id)} 
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(poh.id)} 
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>No POH requests found.</p>}
      
      {!isSearchMode && totalPages > 0 && (
        <div className="flex justify-between mt-4">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 0} 
            className={`px-3 py-1 rounded ${currentPage === 0 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages - 1} 
            className={`px-3 py-1 rounded ${currentPage === totalPages - 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default POHRequestForm;