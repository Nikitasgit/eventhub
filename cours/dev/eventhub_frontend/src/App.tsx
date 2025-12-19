import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppWrapper } from "./modules/app/components/AppWrapper";
import { Layout } from "./modules/app/components/Layout";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ProfilePage,
} from "./modules/user/pages";
import { ProtectedRoute } from "./modules/app/components/ProtectedRoute";

function App() {
  return (
    <AppWrapper>
      <BrowserRouter>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppWrapper>
  );
}

export default App;
