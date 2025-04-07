import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeEmailForm = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [selectedLetterType, setSelectedLetterType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [oldSalary, setOldSalary] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [joiningTime, setJoiningTime] = useState('');
  const [reportingManager, setReportingManager] = useState('');
  const [department, setDepartment] = useState('');
  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [packages, setpackage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [editableBody, setEditableBody] = useState('');
  

  const letterTypes = ['Joining', 'Increment', 'Termination'];
  const API_BASE_URL = 'http://localhost:8081/api';

  useEffect(() => {
    if (selectedLetterType) {
      fetchTemplatesByType(selectedLetterType);
    }
  }, [selectedLetterType]);

  const fetchTemplatesByType = async (type) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/email/templatetype/${type}`);
      setTemplates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch templates');
      setLoading(false);
    }
  };

  const generatePreviewContent = () => {
    let replaced = templateBody;
    const placeholders = {
      '[employeeName]': employeeName,
      '[employeeEmail]': employeeEmail,
      '[oldSalary]': oldSalary,
      '[newSalary]': newSalary,
      '[effectiveDate]': effectiveDate,
      '[joiningDate]': joiningDate,
      '[jobTitle]': jobTitle,
      '[joiningTime]': joiningTime,
      '[reportingManager]': reportingManager,
      '[department]': department,
      '[hrName]': hrName,
      '[hrEmail]': hrEmail,
      '[packages]': packages,
    };
  
    Object.keys(placeholders).forEach((key) => {
      replaced = replaced.replaceAll(key, placeholders[key] || '');
    });
  
    return replaced;
  };
  


  const fetchTemplateBody = async (templateName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/email/template/${templateName}`);
      if (response.data && response.data.body) {
        setTemplateBody(response.data.body);
      } else {
        setTemplateBody('Template body not available');
      }
    } catch (err) {
      setTemplateBody('Failed to load template content');
    }
  };



  


  const resetForm = () => {
    setEmployeeName('');
    setEmployeeEmail('');
    setSelectedLetterType('');
    setSelectedTemplate('');
    setOldSalary('');
    setNewSalary('');
    setEffectiveDate('');
    setJoiningDate('');
    setJobTitle('');
    setJoiningTime('');
    setReportingManager('');
    setDepartment('');
    setHrName('');
    setHrEmail('');
    setpackage('');
  };

  // Function to render additional fields based on letter type
  const renderAdditionalFields = () => {
    switch (selectedLetterType) {
      case 'Increment':
        return (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Old Salary"
                value={oldSalary}
                onChange={(e) => setOldSalary(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="New Salary"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="date"
                placeholder="Effective Date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </>
        );
      case 'Termination':
        return (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Old Salary"
                value={oldSalary}
                onChange={(e) => setOldSalary(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="New Salary"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mb-4">
              <input
                type="date"
                placeholder="Effective Date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </>
        );
      case 'Joining':
        return (<>
          <div className="mb-4">
            <input
              type="date"
              placeholder="joining date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="time"
              placeholder="joining time"
              value={joiningTime}
              onChange={(e) => setJoiningTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="reporting manager"
              value={reportingManager}
              onChange={(e) => setReportingManager(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="hr name"
              value={hrName}
              onChange={(e) => setHrName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="hr email"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="packages"
              value={packages}
              onChange={(e) => setpackage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      fetchTemplateBody(selectedTemplate);
      setShowTemplatePreview(true);
    } else {
      setShowTemplatePreview(false);
    }
  }, [selectedTemplate]);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Send Employee Email</h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              placeholder="Employee Email"
              value={employeeEmail}
              onChange={(e) => setEmployeeEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <select
              value={selectedLetterType}
              onChange={(e) => setSelectedLetterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
              required
            >
              <option value="">Select Letter Type</option>
              {letterTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {selectedLetterType && (
            <div className="mb-4">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                required
              >
                <option value="">Select Template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.templateName}>
                    {template.templateName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Render additional fields based on letter type */}
          {renderAdditionalFields()}

          <div className="mb-2">
          <button
  type="button"
  onClick={() => {
    const preview = generatePreviewContent();
    setEditableBody(preview);
    setShowEditView(true);
  }}
  className="w-full py-2 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition duration-200"
>
  Preview Email
</button>

</div>

        </form>
      </div>

      {showEditView && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3">Email Preview</h3>
      <textarea
        value={editableBody.replace(/<br\s*\/?>/gi, '\n')}
        onChange={(e) => setEditableBody(e.target.value)}
        rows={25}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 font-mono text-sm"
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowEditView(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
  onClick={async () => {
    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('recipientEmail', employeeEmail);
      formData.append('emailBody', editableBody); // Send the preview content
      formData.append('employeeName', employeeName);
      formData.append('lettertype', selectedLetterType);


      await axios.post(`${API_BASE_URL}/email/send`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Email sent successfully!');
      resetForm();
      setShowEditView(false);
    } catch (err) {
      setError('Failed to send email');
    } finally {
      setLoading(false);
    }
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  {loading ? 'Sending...' : 'Send Email'}
</button>

      </div>
    </div>
  </div>
)}


      {selectedTemplate && templateBody && showTemplatePreview && (
        <div className="absolute top-16 right-6 w-[320px] bg-white/70 border border-gray-200 rounded-lg shadow-lg p-4 text-sm text-gray-700 backdrop-blur-sm max-h-[400px] overflow-y-auto">
          <h4 className="font-semibold mb-2">Template Preview</h4>
          {/* <div style={{ whiteSpace: 'pre-wrap' }}>
            {templateBody.replaceAll('<br>', '\n')}
          </div> */}
          {/* <div>
            {templateBody.split('<br>').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div> */}
          <div dangerouslySetInnerHTML={{ __html: templateBody }} />
          {/* <div>
            {templateBody.split('<br>').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div> */}

          <button
            onClick={() => setShowTemplatePreview(false)}
            className="text-sm mt-2 border rounded-full px-3 bg-blue-300 text-gray-500 hover:text-red-500"
          >
            Close Preview
          </button>
        </div>
      )}
    </div>


  );
};

export default EmployeeEmailForm;