import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import entities from "./entities";
import Datatable from "./components/Datatable";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Inter",
  },
  palette: {
    mode: "dark",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {},
      },
      defaultProps: {
        variant: "contained",
        size: "small",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        variant: "contained",
        size: "small",
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/applications" />} />
              {entities.map((entity) => {
                return (
                  <Route
                    key={"Route: " + entity.url}
                    path={entity.url}
                    element={<Datatable entity={entity} />}
                  />
                );
              })}
            </Route>
            <Route path="/auth" element={<Outlet />}>
              <Route path={"/auth/login"} element={<LoginPage />} />
              <Route path={"/auth/register"} element={<RegisterPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
