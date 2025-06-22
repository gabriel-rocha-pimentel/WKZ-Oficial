
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit, Trash2, Loader2, Crown } from 'lucide-react';

const MembersTab = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formState, setFormState] = useState({ nickname: '', role: 'member', status: 'Ativo' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('members').select('*').order('role').order('nickname');
    if (error) {
      toast({ title: 'Erro ao buscar membros', description: error.message, variant: 'destructive' });
    } else {
      setMembers(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  useEffect(() => {
    if (currentMember) {
      setFormState({ nickname: currentMember.nickname, role: currentMember.role, status: currentMember.status, join_date: currentMember.join_date });
    } else {
      setFormState({ nickname: '', role: 'member', status: 'Ativo', join_date: new Date().toISOString().split('T')[0] });
    }
  }, [currentMember, isFormOpen]);

  const handleEdit = (member) => { setCurrentMember(member); setIsFormOpen(true); };
  const handleAddNew = () => { setCurrentMember(null); setIsFormOpen(true); };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('members').upsert({ id: currentMember?.id, ...formState });
    
    if (error) {
      toast({ title: 'Erro ao salvar membro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso!', description: `Membro ${currentMember ? 'atualizado' : 'adicionado'}.` });
      setIsFormOpen(false);
      fetchMembers();
    }
    setIsSubmitting(false);
  };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Membro deletado' });
      fetchMembers();
    }
  };

  return (
    <div className="bg-wkz-gray p-8 rounded-2xl border border-wkz-white/10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron font-bold text-2xl text-wkz-white">Gerenciar Membros</h2>
        <Button onClick={handleAddNew} className="btn-primary"><Plus className="mr-2" size={18} /> Adicionar Membro</Button>
      </div>
      
      <div className="divide-y divide-wkz-white/10">
        {loading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div> :
        members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 first:pt-0 last:pb-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-xl flex items-center justify-center">
                  <span className="text-wkz-black font-bold text-lg">{member.nickname.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-wkz-white font-semibold">{member.nickname}</h3>
                <div className={`flex items-center text-sm ${member.role === 'leader' ? 'text-wkz-yellow' : 'text-wkz-white/60'}`}>
                  {member.role === 'leader' && <Crown className="mr-1.5 h-4 w-4" />}
                  {member.role === 'leader' ? 'Líder' : 'Integrante'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${member.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : member.status === 'Inativo' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{member.status}</span>
              <Button size="icon" variant="ghost" onClick={() => handleEdit(member)}><Edit size={16} /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-wkz-red hover:text-wkz-red/80 hover:bg-wkz-red/10"><Trash2 size={16} /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle><AlertDialogDescription>Isso irá remover permanentemente o membro {member.nickname}.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(member.id)}>Deletar</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentMember ? 'Editar' : 'Adicionar'} Membro</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nickname</label>
              <Input value={formState.nickname} onChange={e => setFormState({...formState, nickname: e.target.value})} className="mt-1 bg-wkz-black/50" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Função</label>
                <Select value={formState.role} onValueChange={value => setFormState({...formState, role: value})}>
                  <SelectTrigger className="mt-1 bg-wkz-black/50"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="member">Integrante</SelectItem><SelectItem value="leader">Líder</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={formState.status} onValueChange={value => setFormState({...formState, status: value})}>
                  <SelectTrigger className="mt-1 bg-wkz-black/50"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem><SelectItem value="Em Pausa">Em Pausa</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersTab;
