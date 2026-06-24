import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "@/react-app/pages/Home";
import Directory from "@/react-app/pages/alumni/Directory";
import Events from "@/react-app/pages/events/Events";
import Jobs from "@/react-app/pages/jobs/Jobs";
import Stories from "@/react-app/pages/stories/Stories";
import Gallery from "@/react-app/pages/gallery/Gallery";
import Profile from "@/react-app/pages/profile/Profile";
import { AuthProvider, useAuth } from "@/react-app/contexts/AuthContext";
import Navbar from "@/react-app/components/Navbar";
import Footer from "@/react-app/components/Footer";
import Login from "@/react-app/pages/auth/Login";
import Register from "@/react-app/pages/auth/Register";
import Dashboard from "@/react-app/pages/dashboard/Dashboard";
// import AdminLogin from "@/react-app/pages/admin/Login";
import AdminUsers from "@/react-app/pages/admin/Users";
import AuditLogs from "@/react-app/pages/admin/AuditLogs";
import SystemSettings from "@/react-app/pages/admin/Settings";
import AdminLayout from "@/react-app/pages/admin/AdminLayout";
import AlumniManagement from "@/react-app/pages/admin/AlumniManagement";
import EventManagement from "@/react-app/pages/admin/EventManagement";
import JobManagement from "@/react-app/pages/admin/JobManagement";
import AdminDashboard from "@/react-app/pages/admin/Dashboard";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return (user && (user.role === 'admin' || user.role === 'superadmin')) ? <>{children}</> : <Navigate to="/login" />;
}

function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return user?.role === 'superadmin' ? <>{children}</> : <Navigate to="/login" />;
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="directory" element={<Directory />} />
            <Route path="events" element={<Events />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="stories" element={<Stories />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="profile/:id" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>
<Route path="/admin/login" element={<Login />} />
  <Route path="/admin" element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }>
    <Route index element={<Navigate to="dashboard" />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="alumni" element={<AlumniManagement />} />
    <Route path="events" element={<EventManagement />} />
    <Route path="jobs" element={<JobManagement />} />
    <Route path="users" element={
      <SuperAdminRoute>
        <AdminUsers />
      </SuperAdminRoute>
    } />
    <Route path="audit" element={
      <SuperAdminRoute>
        <AuditLogs />
      </SuperAdminRoute>
    } />
    <Route path="settings" element={
      <SuperAdminRoute>
        <SystemSettings />
      </SuperAdminRoute>
    } />
  </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
