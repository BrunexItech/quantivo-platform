import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppChat from './components/WhatsAppChat'; // <-- ADDED
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristRegister from './pages/TouristRegister';
import CreatorRegister from './pages/CreatorRegister';
import Dashboard from './pages/Dashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import CreateTour from './pages/CreateTour';
import VRViewer from './pages/VRViewer';
import FAQs from './pages/FAQs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// ===== SCROLL TO TOP COMPONENT =====
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/tourist" element={<TouristRegister />} />
            <Route path="/register/creator" element={<CreatorRegister />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            <Route path="/vr/:id" element={<VRViewer />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/creator/dashboard" element={
              <ProtectedRoute allowedRoles={['content_creator']}><CreatorDashboard /></ProtectedRoute>
            } />
            <Route path="/creator/create-tour" element={
              <ProtectedRoute allowedRoles={['content_creator']}><CreateTour /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
          <WhatsAppChat /> {/* <-- ADDED */}
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;