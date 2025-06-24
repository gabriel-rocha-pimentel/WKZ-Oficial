import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useContact } from '@/hooks/useContact';

const Footer = () => {
  const [clanName, setClanName] = useState('WKZ Oficial');
  const [logoUrl, setLogoUrl] = useState(null);

  const { contacts, loading, getContactIcon, getContactUrl } = useContact();

  useEffect(() => {
    const fetchFooterData = async () => {
      const { data: clan_info } = await supabase
        .from('clan_info')
        .select('name, logo_url')
        .limit(1)
        .single();

      if (clan_info) {
        setClanName(clan_info.name);
        setLogoUrl(clan_info.logo_url);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-wkz-gray border-t border-wkz-red/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center space-x-3 md:col-span-1">
            <div className="w-12 h-12 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo do Clã" className="w-full h-full object-cover" />
              ) : (
                <span className="text-wkz-black font-orbitron font-bold text-2xl">W</span>
              )}
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
              {!loading && contacts.map(contact => (
                <li key={contact.id || contact.type}>
                  <a
                    href={getContactUrl(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 group"
                  >
                    {getContactIcon(contact.type)}
                    <span className="text-wkz-white/70 group-hover:text-wkz-yellow transition-colors">
                      {contact.type}
                    </span>
                  </a>
                </li>
              ))}
              {!loading && contacts.length > 0 && (
                <li>
                  <Link to="/contato" className="text-wkz-yellow hover:text-wkz-white transition-colors text-sm font-semibold">
                    Ver todos...
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-wkz-white/10 pt-8 text-center">
          <p className="text-wkz-white/50 text-sm">
            &copy; {new Date().getFullYear()} {clanName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;