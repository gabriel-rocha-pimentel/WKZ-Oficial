import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Database } from 'lucide-react';
import SEO from '@/components/SEO';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO 
        title="Política de Privacidade"
        description="Entenda como o Clã WKZ Oficial coleta e utiliza seus dados para garantir uma experiência segura e funcional."
        url="/politica-de-privacidade"
      />

      <div className="min-h-screen bg-wkz-black">
        <header className="py-24 bg-gradient-to-b from-wkz-black to-wkz-gray">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-3xl flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                  <FileText size={48} className="text-wkz-black" />
                </div>
              </div>
              <h1 className="font-orbitron font-black text-5xl md:text-6xl text-wkz-white text-glow-red uppercase tracking-wider mb-4">Política de Privacidade</h1>
              <p className="text-lg text-wkz-white/80 max-w-3xl mx-auto">Sua privacidade e segurança são importantes para nós.</p>
            </motion.div>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-8 prose prose-invert prose-lg lg:prose-xl prose-headings:font-orbitron prose-headings:text-wkz-yellow prose-a:text-wkz-red hover:prose-a:text-wkz-yellow">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h2>1. Introdução</h2>
            <p>
              Bem-vindo à Política de Privacidade do Clã WKZ Oficial. Este documento explica como coletamos, usamos e protegemos suas informações quando você utiliza nosso site. Nosso compromisso é com a transparência e a segurança dos seus dados.
            </p>

            <h2>2. Coleta de Dados</h2>
            <p>
              Coletamos informações de duas maneiras principais:
            </p>
            <ul>
              <li>
                <strong>Informações de Autenticação:</strong> Para administradores que acessam o painel de controle, utilizamos o serviço Supabase Auth. Coletamos seu endereço de e-mail para criar e gerenciar sua conta de acesso.
              </li>
              <li>
                <strong>Imagens e Conteúdo:</strong> Imagens enviadas pelos administradores (como logos do clã, imagens de jogos, etc.) são armazenadas no Supabase Storage. Essas imagens são usadas para exibir conteúdo dinâmico no site.
              </li>
            </ul>

            <h2>3. Uso dos Dados</h2>
            <p>
              As informações que coletamos são usadas exclusivamente para:
            </p>
            <ul>
              <li>Permitir o acesso seguro ao painel administrativo.</li>
              <li>Exibir o conteúdo (textos, imagens, regras, membros) no site público.</li>
              <li>Garantir o funcionamento e a manutenção da plataforma.</li>
            </ul>
            <p>
              Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para o funcionamento dos serviços integrados (Supabase), e sempre em conformidade com as leis de proteção de dados.
            </p>

            <h2>4. Segurança dos Dados</h2>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-wkz-gray border border-wkz-white/10 my-6">
              <ShieldCheck size={40} className="text-green-400 flex-shrink-0 mt-1" />
              <p className="text-base">
                Utilizamos a infraestrutura segura do Supabase para armazenar e proteger todos os dados. Isso inclui criptografia em trânsito e em repouso, garantindo que suas informações estejam protegidas contra acessos não autorizados.
              </p>
            </div>

            <h2>5. Seus Direitos</h2>
            <p>
              Como usuário administrador, você tem o direito de acessar, corrigir ou solicitar a exclusão de suas informações pessoais. Para isso, entre em contato com a liderança do clã.
            </p>

            <h2>6. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você revise esta página de tempos em tempos para se manter informado sobre quaisquer alterações.
            </p>

            <h2>7. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através dos canais disponíveis na nossa <Link to="/contato">página de contato</Link>.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;