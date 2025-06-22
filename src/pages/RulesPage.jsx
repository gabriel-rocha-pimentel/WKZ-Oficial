import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import SEO from '@/components/SEO';

const RulesPage = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('rules').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        setRules(data);
      } catch (error) {
        toast({ title: "Erro ao carregar regras", description: "Não foi possível buscar as regras do clã.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, [toast]);

  const getRuleIcon = (type) => {
    switch (type) {
      case 'conduct': return Shield;
      case 'gameplay': return CheckCircle;
      case 'conflict': return AlertTriangle;
      default: return XCircle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-wkz-red';
      case 'medium': return 'border-l-wkz-yellow';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-wkz-gray';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Prioridade Alta';
      case 'medium': return 'Prioridade Média';
      case 'low': return 'Prioridade Baixa';
      default: return 'Normal';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-wkz-black"><Loader2 className="w-16 h-16 animate-spin text-wkz-red" /></div>;
  }

  return (
    <>
      <SEO 
        title="Regras do Clã"
        description="Conheça as regras e diretrizes do Clã WKZ Oficial para manter uma comunidade justa e amigável."
        url="/regras"
      />

      <div className="min-h-screen bg-wkz-black">
        <header className="py-24 bg-gradient-to-b from-wkz-black to-wkz-gray">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-3xl flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                  <Shield size={48} className="text-wkz-black" />
                </div>
              </div>
              <h1 className="font-orbitron font-black text-5xl md:text-6xl text-wkz-white text-glow-red uppercase tracking-wider mb-4">Regras do Clã</h1>
              <p className="text-lg text-wkz-white/80 max-w-3xl mx-auto">Diretrizes para manter nossa comunidade unida, respeitosa e divertida.</p>
            </motion.div>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="space-y-6">
              {rules.map((rule, index) => {
                const Icon = getRuleIcon(rule.type);
                return (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-wkz-gray p-6 rounded-2xl border-l-4 ${getPriorityColor(rule.priority)}`}
                  >
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0 mt-1">
                        <Icon size={24} className={
                          rule.priority === 'high' ? 'text-wkz-red' :
                          rule.priority === 'medium' ? 'text-wkz-yellow' :
                          'text-green-500'
                        } />
                      </div>
                      <div className="flex-1">
                          <h3 className="font-orbitron font-bold text-xl text-wkz-white mb-2">{rule.title}</h3>
                          <p className="text-wkz-white/70 text-lg leading-relaxed">{rule.description}</p>
                      </div>
                       <div className="hidden sm:block">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            rule.priority === 'high' ? 'bg-wkz-red/10 text-wkz-red' :
                            rule.priority === 'medium' ? 'bg-wkz-yellow/10 text-wkz-yellow' :
                            'bg-green-500/10 text-green-400'
                          }`}>
                            {getPriorityText(rule.priority)}
                          </span>
                        </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
             {rules.length === 0 && !loading && (
              <div className="text-center py-16 col-span-full">
                <Shield size={64} className="text-wkz-white/20 mx-auto mb-4" />
                <h3 className="font-orbitron font-bold text-xl text-wkz-white/50 mb-2">Nenhuma regra cadastrada</h3>
                <p className="text-wkz-white/30">Os administradores ainda não definiram as regras do clã.</p>
              </div>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center p-8 rounded-2xl bg-wkz-gray border border-wkz-yellow/20">
              <AlertTriangle size={48} className="text-wkz-yellow mx-auto mb-4" />
              <h2 className="font-orbitron font-bold text-2xl text-wkz-white mb-4">Aviso Importante</h2>
              <p className="text-wkz-white/70 text-lg leading-relaxed">
                O descumprimento das regras pode resultar em advertências, suspensões ou remoção permanente do clã. Jogue limpo, jogue com honra.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RulesPage;