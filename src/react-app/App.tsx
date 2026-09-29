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
import AdminLogin from "@/react-app/pages/admin/Login";
import AdminDashboard from "@/react-app/pages/admin/Dashboard";
import AdminDirectory from "@/react-app/pages/admin/Directory";
import AdminEvents from "@/react-app/pages/admin/Events";
import AdminJobs from "@/react-app/pages/admin/Jobs";
import AdminStories from "@/react-app/pages/admin/Stories";
import AdminGallery from "@/react-app/pages/admin/AdminGallery";
import AdminManagement from "@/react-app/pages/admin/AdminManagement";
import AdminActivity from "@/react-app/pages/admin/Activity";
import AdminLayout from "@/react-app/pages/admin/AdminLayout";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin/login" />;
}


interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#0f172a', padding: '2rem'}}>
          <div style={{maxWidth: '28rem', textAlign: 'center'}}>
            <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444'}}>Something went wrong</h1>
            <p style={{marginBottom: '1rem'}}>The page failed to load properly.</p>
            <div style={{padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'left', overflow: 'auto', maxHeight: '200px'}}>
              <code style={{fontSize: '0.875rem', color: '#b91c1c'}}>{this.state.error?.message || 'Unknown error'}</code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={{backgroundColor: '#0f172a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="admins" element={<AdminManagement />} />
              <Route path="activity" element={<AdminActivity />} />
              <Route path="directory" element={<AdminDirectory />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="stories" element={<AdminStories />} />
              <Route path="gallery" element={<AdminGallery />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

