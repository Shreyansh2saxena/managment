import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Employee", password: "" });
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      if (isSignup) {
        await axios.post("http://localhost:8080/employees/save", formData);
        alert("Signup successful!");
      } else {
        const response = await axios.post(`http://localhost:8080/employees/login?email=${formData.email}&password=${formData.password}`);
        const userId = response.data;

        // Fetch employee details and store them in localStorage
        const userResponse = await axios.get(`http://localhost:8080/employees/getbyemail/${formData.email}`);
        localStorage.setItem("user", JSON.stringify(userResponse.data));

        alert("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Signup/Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "2rem", marginTop: "5rem", textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>{isSignup ? "Sign Up" : "Login"}</Typography>
        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {isSignup && <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />}
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required fullWidth />
          {isSignup && (
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
            </FormControl>
          )}
          <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required fullWidth />
          <Button type="submit" variant="contained" color="primary">{isSignup ? "Sign Up" : "Login"}</Button>
        </form>

        <Typography variant="body2" style={{ marginTop: "1rem" }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <Button color="primary" onClick={() => setIsSignup(!isSignup)}>{isSignup ? "Login" : "Sign Up"}</Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default AuthPage;
