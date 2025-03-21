import React, { useState } from "react";
import emailjs from "emailjs-com";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    template: "joining", 
    salarys: "",
  });

  const templates = {
    joining: "Dear {name},\n\nWelcome to our company! We are pleased to have you on board.",
    increment: "Dear {name},\n\nCongratulations! Your salary has been incremented to {salarys}.",
    salary: "Dear {name},\n\nYour salary has been successfully deposited.",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    
    const templateParams = {
      to_email: formData.email,
      subject: "Official Notification",
      message: templates[formData.template].replace("{name}", formData.name).replace("{salary}", formData.salary),
    };

    emailjs
      .send(
        "service_8qszu1f",
        "template_0i85lad",
        templateParams,
        "1iOQar7pdORaIOpQt"
      )
      .then(
        (response) => {
          alert("Email Sent Successfully!");
        },
        (error) => {
          alert("Failed to send email.");
          console.error(error);
        }
      );
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Send Employee Email</h2>
      <form onSubmit={sendEmail} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Employee Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        
        <select
          name="template"
          value={formData.template}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="joining">Joining Letter</option>
          <option value="increment">Increment Letter</option>

          <option value="salary">Salary Deposit</option>
        </select>
        {
          formData.template === "increment" && (
            <div>
              <input
              type="number"
              name="salarys"
              placeholder="Increment amount"
              value={formData.salarys}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              />
            </div>
          )
        }
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Send Email
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
