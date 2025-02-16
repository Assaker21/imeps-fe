// RegisterPage.jsx
import React, { useState, useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const fields = [
  {
    type: "text",
    label: "First Name",
    field: "firstName",
    required: true,
  },
  {
    type: "text",
    label: "Father Name",
    field: "fatherName",
  },
  {
    type: "text",
    label: "Last Name",
    field: "lastName",
    required: true,
  },
  {
    type: "text",
    label: "Email",
    field: "email",
    required: true,
  },
  {
    type: "password",
    label: "Password",
    field: "password",
    required: true,
  },

  {
    type: "text",
    label: "File Number",
    field: "fileNumber",
  },
  {
    type: "text",
    label: "Phone",
    field: "phone",
  },
  {
    type: "text",
    label: "Branch",
    field: "branch",
  },
  {
    type: "select",
    label: "Year",
    field: "year",
    options: [
      { value: "FIRST", label: "FIRST" },
      { value: "SECOND", label: "SECOND" },
      { value: "THIRD", label: "THIRD" },
      { value: "FOURTH", label: "FOURTH" },
      { value: "FIFTH", label: "FIFTH" },
    ],
  },
  {
    type: "number",
    label: "Ranking",
    field: "ranking",
  },
  {
    type: "number",
    label: "Average",
    field: "average",
  },
  {
    type: "textarea",
    label: "Notes",
    field: "notes",
  },
  {
    type: "select",
    label: "Department",
    field: "department",
    options: [
      { value: "ELECTRICAL", label: "ELECTRICAL" },
      { value: "MECHANICAL", label: "MECHANICAL" },
      { value: "PERTOCHEMICAL", label: "PERTOCHEMICAL" },
      { value: "CIVIL", label: "CIVIL" },
    ],
  },
];

export default function RegisterPage() {
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // We'll store ALL form fields in one object: formData
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/");
  }

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Pass formData object to register
      await register(formData);
      // On success, redirect
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please check your inputs.");
    }
  };

  /**
   * Render one form field based on the 'type'
   */
  const renderField = (f) => {
    const value = formData[f.field] || "";

    if (f.type === "text" || f.type === "password" || f.type === "number") {
      return (
        <TextField
          key={f.field}
          label={f.label}
          type={f.type}
          value={value}
          required={f.required || false}
          onChange={(e) =>
            handleChange(
              f.field,
              f.type === "number" ? Number(e.target.value) : e.target.value
            )
          }
        />
      );
    }

    if (f.type === "textarea") {
      return (
        <TextField
          key={f.field}
          label={f.label}
          multiline
          rows={3}
          value={value}
          onChange={(e) => handleChange(f.field, e.target.value)}
        />
      );
    }

    if (f.type === "select") {
      return (
        <FormControl fullWidth key={f.field}>
          <InputLabel>{f.label}</InputLabel>
          <Select
            label={f.label}
            value={value}
            onChange={(e) => handleChange(f.field, e.target.value)}
          >
            {f.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    // Fallback text input if type is not recognized
    return (
      <TextField
        key={f.field}
        label={f.label}
        value={value}
        onChange={(e) => handleChange(f.field, e.target.value)}
      />
    );
  };

  return (
    <Box
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 10,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" textAlign="start">
        Welcome to IMEPS!
      </Typography>

      <Link component={RouterLink} to="/auth/login">
        <Typography>Already have an account? Login now!</Typography>
      </Link>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {fields.map((f) => renderField(f))}

        <Button size="large" variant="contained" type="submit">
          Register
        </Button>
      </Box>
    </Box>
  );
}
