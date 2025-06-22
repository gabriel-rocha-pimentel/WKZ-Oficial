
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, User, Shield, Database, Gamepad2, LogOut, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import ClanInfoTab from '@/components/admin/ClanInfoTab';
import MembersTab from '@/components/admin/MembersTab';
import RulesTab from '@/components/admin/RulesTab';
import GamesTab from '@/components/admin/GamesTab';
import ContactsTab from '@/components/admin/ContactsTab';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('clan');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Erro ao sair", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logout realizado", description: "Você foi desconectado." });
    }
  };

  const tabs = [
    { id: 'clan', label: 'Identidade do Clã', icon: Shield, component: <ClanInfoTab /> },
    { id: 'members', label: 'Membros', icon: User, component: <MembersTab /> },
    { id: 'games', label: 'Jogos', icon: Gamepad2, component: <GamesTab /> },
    { id: 'rules', label: 'Regras', icon: Database, component: <RulesTab /> },
    { id: 'contacts', label: 'Contatos', icon: Phone, component: <ContactsTab /> },
  ];

  return (
    <div className="flex min-h-screen bg-wkz-black">
      <aside className="w-64 flex-shrink-0 bg-wkz-gray p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 p-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-xl flex items-center justify-center">
              <Settings size={24} className="text-wkz-black" />
            </div>
            <div>
              <h1 className="font-orbitron font-bold text-lg text-wkz-white">Painel</h1>
              <p className="text-xs text-wkz-white/60">Admin WKZ</p>
            </div>
          </div>
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-sm font-semibold transition-colors w-full text-left ${
                    activeTab === tab.id
                      ? 'bg-wkz-red text-wkz-white'
                      : 'text-wkz-white/70 hover:bg-wkz-white/10 hover:text-wkz-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-wkz-white/70 hover:bg-wkz-red/20 hover:text-wkz-red">
          <LogOut className="mr-3 h-5 w-5" /> Sair
        </Button>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {tabs.find(tab => tab.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
