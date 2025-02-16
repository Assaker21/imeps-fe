import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router"; // or your router of choice
import { AuthContext, useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If user is already logged in, navigate away
  if (isAuthenticated) {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await login(email, password);
      // On success, navigate to some route
      navigate("/");
    } catch (err) {
      setError("Login failed. Check your credentials.");
      console.error(err);
    }
  };

  return (
    <Box
      elevation={3}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" textAlign="start">
        Welcome back!
      </Typography>

      <Link component={RouterLink} to="/auth/register">
        <Typography>Don't have an account? Register now!</Typography>
      </Link>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />

        <Button size="large" variant="contained" type="submit">
          Login
        </Button>
      </Box>
    </Box>
  );
}
