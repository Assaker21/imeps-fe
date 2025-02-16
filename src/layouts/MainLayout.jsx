import React from "react";
import { Navigate, Outlet } from "react-router";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";

function MainLayout() {
  const auth = useAuth();

  if (!auth.isAuthenticated) return <Navigate to="/auth/login" />;
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
