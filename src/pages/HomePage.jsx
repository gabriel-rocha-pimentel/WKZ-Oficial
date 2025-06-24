import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Trophy, Users, Gamepad2, Zap, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const HomePage = () => {
  const { toast } = useToast();
  const [clanData, setClanData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: info, error: infoError } = await supabase.from('clan_info').select('*').limit(1).single();
        if (infoError && infoError.code !== 'PGRST116') throw infoError;

        const { data: games, error: gamesError } = await supabase.from('games').select('*');
        if (gamesError) throw gamesError;

        setClanData({ ...info, games });
      } catch (error) {
        toast({ title: "Erro ao carregar dados", description: "Não foi possível buscar as informações do clã.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const features = [
    { icon: Shield, title: 'Comunidade Sólida', description: 'Jogadores dedicados e respeitosos' },
    { icon: Target, title: 'Foco na Diversão', description: 'Jogatinas casuais e sem pressão' },
    { icon: Trophy, title: 'Amizade', description: 'Um lugar para fazer novos amigos' },
    { icon: Users, title: 'Trabalho em Equipe', description: 'Coordenação e comunicação para rir junto' }
  ];

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
        title={clanData?.name || 'Página Inicial'}
        description={clanData?.description || 'Comunidade gamer focada em diversão e amizade. Junte-se ao Clã WKZ Oficial!'}
        imageUrl={clanData?.logo_url}
        url="/"
      />

      <div>
        {/* HERO */}
        <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-wkz-black">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              alt="background de soldados futuristas"
              src="https://images.unsplash.com/photo-1559153291-4b10edd3786e"
              loading="lazy"
              decoding="async"
              sizes="100vw"
              style={{ objectPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-wkz-black/50 via-wkz-black to-wkz-black"></div>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                {clanData?.logo_url ? (
                  <img
                    src={clanData.logo_url}
                    alt={`${clanData.name} Logo`}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-3xl flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                    <span className="text-wkz-black font-orbitron font-black text-4xl sm:text-5xl">W</span>
                  </div>
                )}
              </motion.div>
              <h1 className="font-orbitron font-black text-3xl sm:text-5xl md:text-7xl text-wkz-white text-glow-red uppercase tracking-wider break-words">
                {clanData?.name}
              </h1>
              <p className="text-base sm:text-xl text-wkz-white/80 max-w-3xl mx-auto leading-relaxed">
                {clanData?.description}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link
                  to="/membros"
                  className="inline-flex items-center btn-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-rajdhani text-lg sm:text-xl"
                  aria-label="Conheça a Equipe"
                >
                  Conheça a Equipe <ArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 sm:py-24 bg-wkz-gray">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="font-orbitron font-bold text-2xl sm:text-4xl md:text-5xl text-wkz-white mb-4">
                Por que escolher o <span className="text-wkz-red">WKZ</span>?
              </h2>
              <p className="text-base sm:text-lg text-wkz-white/70 max-w-3xl mx-auto">
                Somos mais que um clã, somos uma família de gamers forjada na amizade.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="card-hover p-6 sm:p-8 rounded-2xl bg-wkz-black/50 border border-wkz-white/10 text-center flex flex-col items-center"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                      <Icon size={28} className="sm:size-32 text-wkz-black" />
                    </div>
                    <h3 className="font-orbitron font-bold text-lg sm:text-xl text-wkz-white mb-2">{feature.title}</h3>
                    <p className="text-wkz-white/60 text-sm sm:text-base">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* GAMES */}
        <section className="py-16 sm:py-24 bg-wkz-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-16"
            >
              <h2 className="font-orbitron font-bold text-2xl sm:text-4xl md:text-5xl text-wkz-white mb-4">
                Nossos <span className="text-wkz-yellow">Campos de Batalha</span>
              </h2>
              <p className="text-base sm:text-lg text-wkz-white/70 max-w-3xl mx-auto">
                Jogamos por diversão, em qualquer plataforma.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {clanData?.games?.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-wkz-gray p-6 sm:p-8 rounded-2xl border border-wkz-yellow/20 transition-all duration-300 hover:border-wkz-yellow/50 hover:shadow-2xl hover:shadow-wkz-yellow/10 flex flex-col"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    {game.image_url ? (
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mr-3 sm:mr-4 object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Gamepad2 size={28} className="sm:size-32 text-wkz-yellow mr-3 sm:mr-4" />
                    )}
                    <div>
                      <h3 className="font-orbitron font-bold text-lg sm:text-2xl text-wkz-white">{game.name}</h3>
                      <p className="text-wkz-yellow font-semibold text-xs sm:text-base">{game.platform}</p>
                    </div>
                  </div>
                  <p className="text-wkz-white/70 text-base sm:text-lg flex-1">{game.description}</p>
                  <div className="mt-4 sm:mt-6 flex items-center text-wkz-red">
                    <Zap size={18} className="sm:size-20 mr-2" />
                    <span className="font-medium text-sm sm:text-base">Sempre Ativo</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-24 bg-gradient-to-t from-wkz-gray to-wkz-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-orbitron font-black text-2xl sm:text-4xl md:text-5xl text-wkz-white mb-4 sm:mb-6 uppercase">
                Junte-se a Nós!
              </h2>
              <p className="text-base sm:text-xl text-wkz-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Gostou do que viu? Entre em contato conosco e venha fazer parte da nossa comunidade de amigos.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contato"
                  className="btn-primary px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-rajdhani text-lg sm:text-2xl"
                  aria-label="Fale Conosco"
                >
                  Fale Conosco
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;