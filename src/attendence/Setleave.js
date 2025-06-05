import React, { useEffect, useState } from 'react'
import axiosInstance from '../util/axiosInstance';

const Setleave = () => {
    const [employeeName, setEmployeeName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [leaveCount, setLeaveCount] = useState(0);
    const [leavedata, setleavedata] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (!employeeName || !employeeId || leaveCount <= 0) {
            alert("Please fill all fields correctly.");
            return;
        }
        try {
            const response = await axiosInstance.post(`/leaves/add?empId=${employeeId}&count=${leaveCount}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": "application/json"

                }
            });
            if (response.status === 200) {
                alert("successful")
                setEmployeeId("");
                setEmployeeName("");
                setLeaveCount(0);
                hfetch(); // Refresh the table after successful submission
            }
        } catch (error) {
            alert("Error allocating leaves. Please try again.");
            console.error("Error allocating leaves:", error);
        }
    }

    const hfetch = async () => {
        try {
            const res = await axiosInstance.get(`/leaves/details`,{
        headers:{
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          "Content-Type": "application/json"
          
        }
      });
            setleavedata(res.data);
            setAllEmployees(res.data); // Store all employees for search suggestions
        }
        catch (error) {
            console.error("Error fetching leave data:", error);
            alert("Error fetching leave data. Please try again.");
            setleavedata([]);
            setAllEmployees([]);
        }
    }

    // Search function now searches by name instead of ID
    const hsearchByName = async (name) => {
        if (!name) {
            setleavedata(allEmployees);
            return;
        }

        try {
            // Filter locally by name (case insensitive)
            const filteredResults = allEmployees.filter(emp =>
                emp.employeeName.toLowerCase().includes(name.toLowerCase())
            );
            setleavedata(filteredResults);
        }
        catch (e) {
            console.error("error", e);
            alert("Error searching leave data. Please try again.");
            setleavedata([]);
        }
    }

    const handleSearch = () => {
        hsearchByName(searchName);
        setShowSuggestions(false);
    }

    // Generate suggestions as user types
    const handleSearchInputChange = (e) => {
        const input = e.target.value;
        setSearchName(input);

        if (input.length > 0) {
            const filteredSuggestions = allEmployees.filter(emp =>
                emp.employeeName.toLowerCase().includes(input.toLowerCase())
            ).slice(0, 5); // Limit to 5 suggestions

            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    const selectSuggestion = (employee) => {
        setSearchName(employee.employeeName);
        setSuggestions([]);
        setShowSuggestions(false);
        setleavedata([employee]); // Show only the selected employee
    }

    useEffect(() => {
        hfetch();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center">Allocate Leaves</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium">Employee Name</label>
                                <input
                                    type="text"
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter name"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Employee ID</label>
                                <input
                                    type="text"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter ID"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Number of Leaves</label>
                                <input
                                    type="number"
                                    value={leaveCount}
                                    onChange={(e) => setLeaveCount(parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter leave count"
                                    min="1"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                            >
                                Allocate
                            </button>
                        </form>

                        <div className="mt-8 relative">
                            <h2 className="text-2xl font-bold mb-4 text-center">Search Leaves</h2>
                            <div className="flex space-x-2">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={searchName}
                                        onChange={handleSearchInputChange}
                                        onFocus={() => searchName && setSuggestions.length > 0 && setShowSuggestions(true)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Search by employee name"
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                            {suggestions.map(emp => (
                                                <div
                                                    key={emp.empId}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                                                    onClick={() => selectSuggestion(emp)}
                                                >
                                                    <span className="font-medium">{emp.employeeName}</span>
                                                    <span className="text-gray-500 ml-2">({emp.empId})</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Search
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchName("");
                                    setleavedata(allEmployees);
                                    setSuggestions([]);
                                    setShowSuggestions(false);
                                }}
                                className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                            >
                                Clear Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:w-2/3">
                    {leavedata.length > 0 ? (
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">Employees Leave Info</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border border-gray-300 text-center rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-4 py-2">Employee ID</th>
                                            <th className="border px-4 py-2">Name</th>
                                            <th className="border px-4 py-2">Role</th>
                                            <th className="border px-4 py-2">Email</th>
                                            <th className="border px-4 py-2">Leaves</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leavedata.map((emp, index) => (
                                            <tr key={emp.empId || index} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2">{emp.empId}</td>
                                                <td className="border px-4 py-2">{emp.employeeName}</td>
                                                <td className="border px-4 py-2">{emp.role}</td>
                                                <td className="border px-4 py-2">{emp.email}</td>
                                                <td className="border px-4 py-2">{emp.leaves}</td>
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
        </div>
    )
}

export default Setleave