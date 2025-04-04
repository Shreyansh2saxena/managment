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
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const [hoveredTemplate, setHoveredTemplate] = useState('');


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
      const response = await axios.get(`${API_BASE_URL}/email/template/type/${type}`);
      setTemplates(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch templates');
      setLoading(false);
    }
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeName || !employeeEmail || !selectedTemplate) {
      setError('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('templateName', selectedTemplate);
      formData.append('recipientEmail', employeeEmail);
      formData.append('employeeName', employeeName);

      if (selectedLetterType === 'Increment' || selectedLetterType === 'Termination') {
        formData.append('oldSalary', oldSalary);
        formData.append('newSalary', newSalary);
        formData.append('effectiveDate', effectiveDate);
      }

      if (selectedLetterType === 'Joining') {
        formData.append('joiningDate', joiningDate);
        formData.append('jobTitle', jobTitle);
        formData.append('joiningTime', joiningTime);
        formData.append('reportingManager', reportingManager);
        formData.append('department', department);
        formData.append('hrName', hrName);
        formData.append('hrEmail', hrEmail);
        formData.append('packages', packages);
      }

      await axios.post(`${API_BASE_URL}/email/send`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Email sent successfully!');
      resetForm();
    } catch (err) {
      setError('Failed to send email');
    } finally {
      setLoading(false);
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

        <form onSubmit={handleSubmit}>
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
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
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