import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from '@/components/SEO';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('members').select('*');
        if (error) throw error;
        setMembers(data);
      } catch (error) {
        toast({ title: "Erro ao carregar membros", description: "Não foi possível buscar os membros do clã.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [toast]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500';
      case 'Em Pausa': return 'bg-yellow-500';
      case 'Inativo': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredMembers = members
    .filter(member =>
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterRole === 'all' || member.role === filterRole)
    )
    .sort((a, b) => {
      if (a.role === 'leader' && b.role !== 'leader') return -1;
      if (b.role === 'leader' && a.role !== 'leader') return 1;
      if (a.status === 'Ativo' && b.status !== 'Ativo') return -1;
      if (b.status === 'Ativo' && a.status !== 'Ativo') return 1;
      return a.nickname.localeCompare(b.nickname);
    });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-wkz-black"><Loader2 className="w-16 h-16 animate-spin text-wkz-red" /></div>;
  }

  return (
    <>
      <SEO 
        title="Membros do Clã"
        description="Conheça os membros que fazem parte da comunidade WKZ Oficial."
        url="/membros"
      />

      <div className="min-h-screen bg-wkz-black">
        <header className="py-24 bg-gradient-to-b from-wkz-black to-wkz-gray">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-3xl flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
                  <Users size={48} className="text-wkz-black" />
                </div>
              </div>
              <h1 className="font-orbitron font-black text-5xl md:text-6xl text-wkz-white text-glow-red uppercase tracking-wider mb-4">Nossos Membros</h1>
              <p className="text-lg text-wkz-white/80 max-w-3xl mx-auto">A força do clã está em cada um de seus integrantes.</p>
            </motion.div>
          </div>
        </header>

        <section className="py-8 bg-wkz-gray/50 sticky top-20 z-30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full max-w-md">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-wkz-white/50" />
                <Input type="text" placeholder="Buscar por nickname..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 h-12 rounded-xl bg-wkz-black/50 border-wkz-white/10 focus:border-wkz-red" />
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <Filter size={20} className="text-wkz-white/50" />
                <Select onValueChange={setFilterRole} defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl bg-wkz-black/50 border-wkz-white/10 focus:border-wkz-red">
                    <SelectValue placeholder="Filtrar por cargo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-wkz-gray border-wkz-white/10 text-wkz-white">
                    <SelectItem value="all">Todos os Cargos</SelectItem>
                    <SelectItem value="leader">Líderes</SelectItem>
                    <SelectItem value="member">Integrantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredMembers.map((member) => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} key={member.id} className="bg-wkz-gray p-6 rounded-2xl border border-wkz-white/10 card-hover">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-wkz-black font-orbitron font-bold text-2xl">{member.nickname.charAt(0)}</span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-wkz-gray ${getStatusColor(member.status)}`} title={`Status: ${member.status}`}></div>
                        </div>
                        <div>
                          <h3 className="font-orbitron font-bold text-lg text-wkz-white">{member.nickname}</h3>
                          <p className={`text-sm font-semibold ${member.role === 'leader' ? 'text-wkz-yellow' : 'text-wkz-white/50'}`}>{member.role === 'leader' ? 'Líder' : 'Integrante'}</p>
                        </div>
                      </div>
                      {member.role === 'leader' && <Crown size={24} className="text-wkz-yellow" />}
                    </div>
                    <div className="space-y-3 bg-wkz-black/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center text-sm"><span className="text-wkz-white/60">Status:</span><span className={`font-bold`} style={{color: getStatusColor(member.status) === 'bg-green-500' ? '#4ade80' : getStatusColor(member.status) === 'bg-yellow-500' ? '#facc15' : '#9ca3af'}}>{member.status}</span></div>
                      <div className="flex justify-between items-center text-sm"><span className="text-wkz-white/60">No clã desde:</span><span className="font-semibold text-wkz-white/80">{new Date(member.join_date).toLocaleDateString('pt-BR')}</span></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {filteredMembers.length === 0 && (
              <div className="text-center py-16 col-span-full">
                <Users size={64} className="text-wkz-white/20 mx-auto mb-4" />
                <h3 className="font-orbitron font-bold text-xl text-wkz-white/50 mb-2">Nenhum membro encontrado</h3>
                <p className="text-wkz-white/30">Tente ajustar os filtros de busca.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default MembersPage;