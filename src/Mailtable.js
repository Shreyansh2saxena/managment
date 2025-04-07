import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmailListPage = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmailBody, setSelectedEmailBody] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/email/mailrecordpage/getall?page=0&size=10');
      setEmails(response.data.content);
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-8 relative">
      <h1 className="text-2xl font-bold mb-6">Email Records</h1>
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
            {emails.map((email) => {
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
            })}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {selectedEmailBody && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h2 className="text-xl font-semibold mb-4">Email Preview</h2>
            <pre className="whitespace-pre-wrap text-gray-800 mb-4 max-h-96 overflow-y-auto">{selectedEmailBody}</pre>
            <button
              onClick={closePreview}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailListPage;
