import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/admin/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import SEO from '@/components/SEO';

const AdminPage = () => {
  const { session } = useAuth();

  return (
    <>
      <SEO 
        title="Painel Admin"
        description="Painel administrativo do Clã WKZ Oficial. Acesso restrito aos administradores."
        url="/admin"
      />
      
      <div className="min-h-screen bg-wkz-black">
        <AnimatePresence mode="wait">
          {!session ? (
            <motion.div key="login">
              <LoginForm />
            </motion.div>
          ) : (
            <motion.div key="dashboard">
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminPage;