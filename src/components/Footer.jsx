import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Mail, MessageSquare, Phone, Share2 } from 'lucide-react';

const Footer = () => {
  const [contacts, setContacts] = useState([]);
  const [clanName, setClanName] = useState('WKZ Oficial');
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('type, value')
        .eq('is_active', true)
        .limit(3);
      
      if (contactsData) setContacts(contactsData);

      const { data: clanInfo } = await supabase
        .from('clan_info')
        .select('name, logo_url')
        .limit(1)
        .single();

      if (clanInfo) {
        setClanName(clanInfo.name);
        setLogoUrl(clanInfo.logo_url);
      }
    };

    fetchFooterData();
  }, []);

  const getContactIcon = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('mail')) return <Mail size={20} className="text-wkz-white/70 group-hover:text-wkz-yellow transition-colors" />;
    if (lowerType.includes('whatsapp')) return <MessageSquare size={20} className="text-wkz-white/70 group-hover:text-wkz-yellow transition-colors" />;
    if (lowerType.includes('discord')) return <Share2 size={20} className="text-wkz-white/70 group-hover:text-wkz-yellow transition-colors" />;
    return <Phone size={20} className="text-wkz-white/70 group-hover:text-wkz-yellow transition-colors" />;
  };

  return (
    <footer className="bg-wkz-gray border-t border-wkz-red/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-3 md:col-span-1">
             <div className="w-12 h-12 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              {logoUrl ? <img src={logoUrl} alt="Logo do Clã" className="w-full h-full object-cover" /> : <span className="text-wkz-black font-orbitron font-bold text-2xl">W</span>}
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-xl text-wkz-white">{clanName}</h3>
              <p className="text-wkz-white/50 text-sm">Comunidade Gamer</p>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-orbitron font-semibold text-lg text-wkz-white mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-wkz-white/70 hover:text-wkz-yellow transition-colors">Sobre</Link></li>
              <li><Link to="/regras" className="text-wkz-white/70 hover:text-wkz-yellow transition-colors">Regras</Link></li>
              <li><Link to="/membros" className="text-wkz-white/70 hover:text-wkz-yellow transition-colors">Membros</Link></li>
              <li><Link to="/contato" className="text-wkz-white/70 hover:text-wkz-yellow transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-orbitron font-semibold text-lg text-wkz-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/politica-de-privacidade" className="text-wkz-white/70 hover:text-wkz-yellow transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-orbitron font-semibold text-lg text-wkz-white mb-4">Fale Conosco</h4>
            <ul className="space-y-3">
              {contacts.map(contact => (
                <li key={contact.type}>
                  <a href={contact.value.startsWith('http') ? contact.value : `mailto:${contact.value}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                    {getContactIcon(contact.type)}
                    <span className="text-wkz-white/70 group-hover:text-wkz-yellow transition-colors">{contact.type}</span>
                  </a>
                </li>
              ))}
               {contacts.length > 0 && (
                 <li>
                    <Link to="/contato" className="text-wkz-yellow hover:text-wkz-white transition-colors text-sm font-semibold">Ver todos...</Link>
                 </li>
               )}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-wkz-white/10 pt-8 text-center">
          <p className="text-wkz-white/50 text-sm">&copy; {new Date().getFullYear()} {clanName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;