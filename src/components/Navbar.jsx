import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Users, FileText, Settings, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [clanInfo, setClanInfo] = useState({ name: 'WKZ OFICIAL', logo_url: null });
  const location = useLocation();
  const { session } = useAuth();

  useEffect(() => {
    const fetchClanInfo = async () => {
      const { data, error } = await supabase
        .from('clan_info')
        .select('name, logo_url')
        .limit(1)
        .single();

      if (data) {
        setClanInfo({ name: data.name || 'WKZ OFICIAL', logo_url: data.logo_url });
      }
    };

    fetchClanInfo();
  }, []);

  const navItems = [
    { path: '/', label: 'Sobre', icon: Shield },
    { path: '/regras', label: 'Regras', icon: FileText },
    { path: '/membros', label: 'Membros', icon: Users },
    { path: '/contato', label: 'Contato', icon: Phone },
  ];
  
  if (session) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Settings });
  }

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nameParts = clanInfo.name.split(' ');
  const firstName = nameParts[0] || '';
  const restOfName = nameParts.slice(1).join(' ');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-wkz-black/95 backdrop-blur-lg border-b border-wkz-red/20' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="w-12 h-12 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
            >
              {clanInfo.logo_url ? (
                <img src={clanInfo.logo_url} alt="Logo do Clã" className="w-full h-full object-cover" />
              ) : (
                <span className="text-wkz-black font-orbitron font-bold text-2xl">W</span>
              )}
            </motion.div>
            <span className="font-orbitron font-bold text-2xl text-wkz-white">
              {firstName} {restOfName && <span className="text-wkz-red">{restOfName}</span>}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(item.path)
                      ? 'text-wkz-yellow active'
                      : 'text-wkz-white/80 hover:text-wkz-white hover:bg-wkz-gray/50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-wkz-white p-2"
              aria-label="Toggle Menu"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-wkz-black/95 backdrop-blur-lg border-t border-wkz-red/20"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      isActive(item.path)
                        ? 'text-wkz-yellow bg-wkz-red/10'
                        : 'text-wkz-white/80 hover:text-wkz-white hover:bg-wkz-gray/50'
                    }`}
                  >
                    <Icon size={22} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;