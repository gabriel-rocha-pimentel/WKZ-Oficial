import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Phone, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { useContact } from '@/hooks/useContact';

const ContactPage = () => {
  const { contacts, loading, getContactIcon, getContactUrl } = useContact();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wkz-black">
        <Loader2 className="w-16 h-16 animate-spin text-wkz-red" />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Contato"
        description="Entre em contato com o Clã WKZ Oficial. Estamos disponíveis em diversas plataformas para tirar suas dúvidas."
        url="/contato"
      />

      <div className="min-h-screen bg-wkz-black">
        <header className="py-24 bg-gradient-to-b from-wkz-black to-wkz-gray">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-3xl flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                  <Phone size={48} className="text-wkz-black" />
                </div>
              </div>
              <h1 className="font-orbitron font-black text-5xl md:text-6xl text-wkz-white text-glow-red uppercase tracking-wider mb-4">Entre em Contato</h1>
              <p className="text-lg text-wkz-white/80 max-w-3xl mx-auto">Tem alguma dúvida ou quer se juntar a nós? Fale conosco!</p>
            </motion.div>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contacts.map((contact, index) => (
                <motion.a
                  key={contact.id}
                  href={getContactUrl(contact)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="card-hover block p-8 rounded-2xl bg-wkz-gray border border-wkz-white/10"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 mt-1">
                      {getContactIcon(contact.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-orbitron font-bold text-xl text-wkz-white mb-2">{contact.type}</h3>
                      <p className="text-wkz-white/70 text-lg break-words">{contact.value}</p>
                    </div>
                    <ExternalLink size={20} className="text-wkz-white/50 flex-shrink-0" />
                  </div>
                </motion.a>
              ))}
            </div>
            {contacts.length === 0 && !loading && (
              <div className="text-center py-16 col-span-full">
                <Phone size={64} className="text-wkz-white/20 mx-auto mb-4" />
                <h3 className="font-orbitron font-bold text-xl text-wkz-white/50 mb-2">Nenhum contato disponível</h3>
                <p className="text-wkz-white/30">Os administradores ainda não cadastraram nenhum meio de contato.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
