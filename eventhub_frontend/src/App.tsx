import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";
import { AppWrapper } from "./modules/app/components/AppWrapper";
import { Layout } from "./modules/app/components/Layout";
import { AppInitializer } from "./modules/app/components/AppInitializer";
import { HomePage } from "./modules/common/pages";
import { ProfilePage } from "./modules/user/pages";
import { LoginPage, RegisterPage } from "./modules/auth/pages";
import { ProtectedRoute } from "./modules/app/components/ProtectedRoute";

const DashboardPage = lazy(
  () => import("./modules/analytics/pages/DashboardPage"),
);

function App() {
  return (
    <AppWrapper>
      <BrowserRouter>
        <AppInitializer />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense
                    fallback={
                      <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress size={48} />
                      </Box>
                    }
                  >
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppWrapper>
  );
}

export default App;
