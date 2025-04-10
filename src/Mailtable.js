import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmailListPage = () => {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmailBody, setSelectedEmailBody] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page,setPage] = useState(0);
      const [totPage , settotpage] = useState(1);
      const size = 10; 
  

  useEffect(() => {
    fetchEmails();
  }, [page]);

  useEffect(() => {
    if (emails.length > 0) {
      handleSearch(searchTerm);
    }
  }, [searchTerm, emails]);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/email/mailrecordpage/getall?page=${page}&size=${size}`);
      const data = response.data;
         setEmails(data.content);
          setFilteredEmails(data.content);
    } catch (err) {
      setError('Failed to fetch emails.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatEmailBody = (body) => {
    return body.replace(/<br\s*\/?>/gi, '\n');
  };

  const handleReadMore = (body) => {
    setSelectedEmailBody(formatEmailBody(body));
  };

  const closePreview = () => {
    setSelectedEmailBody(null);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // Filter emails based on search term
    if (value.trim() === '') {
      setFilteredEmails(emails);
      setSuggestions([]);
      return;
    }
    
    const lowerCaseSearch = value.toLowerCase();
    
    // Filter emails for the table - still search across all fields
    const filtered = emails.filter(email => 
      email.employeeName?.toLowerCase().includes(lowerCaseSearch) ||
      email.templateName?.toLowerCase().includes(lowerCaseSearch) ||
      email.lettertype?.toLowerCase().includes(lowerCaseSearch)
    );
    
    setFilteredEmails(filtered);
    
    // Only generate employee name suggestions with IDs
    const employeeSuggestions = [];
    const addedEmployees = new Set();
    
    emails.forEach(email => {
      if (email.employeeName?.toLowerCase().includes(lowerCaseSearch) && !addedEmployees.has(email.employeeName)) {
        employeeSuggestions.push({
          id: email.id,
          name: email.employeeName
        });
        addedEmployees.add(email.employeeName);
      }
    });
    
    setSuggestions(employeeSuggestions.slice(0, 10)); // Limit to 10 suggestions
    setShowSuggestions(employeeSuggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    
    // Filter to show only emails from this employee
    const employeeEmails = emails.filter(email => 
      email.employeeName === suggestion.name
    );
    setFilteredEmails(employeeEmails);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-8 relative">
      <h1 className="text-2xl font-bold mb-6">Email Records</h1>
      
      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search by employee name, template, or letter type..."
            className="w-full px-4 py-2 focus:outline-none"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <div className="bg-gray-100 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Employee name suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                <span className="font-medium">{suggestion.name}</span>
                <span className="text-gray-500 text-sm ml-2">(ID: {suggestion.id})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-5 text-left">ID</th>
              <th className="py-3 px-5 text-left">Letter Type</th>
              <th className="py-3 px-5 text-left">Template Type</th>
              <th className="py-3 px-5 text-left">Employee Name</th>
              <th className="py-3 px-5 text-left">Date Time</th>
              <th className="py-3 px-5 text-left">Recipient Email</th>
              <th className="py-3 px-5 text-left">Email Body</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => {
                const plainTextBody = formatEmailBody(email.emailBody);
                const isLong = plainTextBody.length > 100;
                return (
                  <tr key={email.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-5">{email.id}</td>
                    <td className="py-3 px-5">{email.lettertype}</td>
                    <td className="py-3 px-5">{email.templateName}</td>
                    <td className="py-3 px-5">{email.employeeName}</td>
                    <td className="py-3 px-5">{new Date(email.dateTime).toLocaleString()}</td>
                    <td className="py-3 px-5">{email.recipientEmail}</td>
                    <td className="py-3 px-5 max-w-xs overflow-hidden overflow-ellipsis">
                      {isLong ? (
                        <>
                          {plainTextBody.slice(0, 100)}...
                          <button
                            onClick={() => handleReadMore(email.emailBody)}
                            className="text-blue-600 hover:underline ml-2"
                          >
                            Read more
                          </button>
                        </>
                      ) : (
                        plainTextBody
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">No emails found matching your search</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {selectedEmailBody && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Email Preview</h2>
            <p className="whitespace-pre-wrap text-gray-800 mb-4 max-h-96 overflow-y-auto">{selectedEmailBody}</p>
            <button
              onClick={closePreview}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
        <div className="flex justify-between items-center my-4">
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
    disabled={page === 0}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-lg">Page {page + 1} of {totPage}</span>

  <button
    onClick={() => setPage((prev) => (prev + 1 < totPage ? prev + 1 : prev))}
    disabled={page + 1 >= totPage}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
    </div>
  );
};

export default EmailListPage;