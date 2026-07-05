import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/SignupPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import CreateRequestPage from "./pages/CreateRequestPage";
import RideRequestDetailsPage from "./pages/RideRequestDetailsPage";
import ManageJoinRequestsPage from "./pages/ManageJoinRequestsPage";
import MyRequestsPage from "./pages/MyRequestsPage";
import ChatListPage from "./pages/ChatListPage";
import ChatWindowPage from "./pages/ChatWindowPage";
import { ThemeProvider } from "./context/ThemeContext";
function App() {
  return (
     <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-request"
            element={
              <ProtectedRoute>
                <CreateRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ride-requests/:id"
            element={
              <ProtectedRoute>
                <RideRequestDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ride-requests/:id/requests"
            element={
              <ProtectedRoute>
                <ManageJoinRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <ChatListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats/:chatId"
            element={
              <ProtectedRoute>
                <ChatWindowPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;