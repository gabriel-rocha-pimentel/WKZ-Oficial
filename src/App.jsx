import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import RulesPage from '@/pages/RulesPage';
import MembersPage from '@/pages/MembersPage';
import AdminPage from '@/pages/AdminPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import PageWrapper from '@/components/PageWrapper';
import { Analytics } from "@vercel/analytics/next"

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/regras" element={<PageWrapper><RulesPage /></PageWrapper>} />
        <Route path="/membros" element={<PageWrapper><MembersPage /></PageWrapper>} />
        <Route path="/contato" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
        <Route path="/politica-de-privacidade" element={<PageWrapper><PrivacyPolicyPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-wkz-black text-wkz-white flex flex-col">
        <Navbar />
        <main className="pt-20 flex-grow">
          <AppRoutes />
          <Analytics />
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;