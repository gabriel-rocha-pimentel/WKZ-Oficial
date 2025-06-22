
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const RulesTab = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [formState, setFormState] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('rules').select('*').order('created_at');
    if (error) {
      toast({ title: 'Erro ao buscar regras', description: error.message, variant: 'destructive' });
    } else {
      setRules(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  useEffect(() => {
    if (currentRule) {
      setFormState({ title: currentRule.title, description: currentRule.description });
    } else {
      setFormState({ title: '', description: '' });
    }
  }, [currentRule, isFormOpen]);
  
  const handleEdit = (rule) => { setCurrentRule(rule); setIsFormOpen(true); };
  const handleAddNew = () => { setCurrentRule(null); setIsFormOpen(true); };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('rules').upsert({ id: currentRule?.id, ...formState });
    
    if (error) {
      toast({ title: 'Erro ao salvar regra', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso!', description: `Regra ${currentRule ? 'atualizada' : 'adicionada'}.` });
      setIsFormOpen(false);
      fetchRules();
    }
    setIsSubmitting(false);
  };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('rules').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Regra deletada' });
      fetchRules();
    }
  };

  return (
    <div className="bg-wkz-gray p-8 rounded-2xl border border-wkz-white/10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron font-bold text-2xl text-wkz-white">Gerenciar Regras</h2>
        <Button onClick={handleAddNew} className="btn-primary"><Plus className="mr-2" size={18} /> Adicionar Regra</Button>
      </div>
      
      <div className="divide-y divide-wkz-white/10">
        {loading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div> :
        rules.map((rule) => (
          <div key={rule.id} className="p-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-wkz-white font-semibold">{rule.title}</h3>
                <p className="text-wkz-white/60 text-sm mt-1">{rule.description}</p>
              </div>
              <div className="flex space-x-2 flex-shrink-0 ml-4">
                <Button size="icon" variant="ghost" onClick={() => handleEdit(rule)}><Edit size={16} /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-wkz-red hover:text-wkz-red/80 hover:bg-wkz-red/10"><Trash2 size={16} /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle><AlertDialogDescription>Isso irá deletar permanentemente a regra: "{rule.title}".</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(rule.id)}>Deletar</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentRule ? 'Editar' : 'Adicionar'} Regra</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título da Regra</label>
              <Input value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} className="mt-1 bg-wkz-black/50" required />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} className="mt-1 bg-wkz-black/50" required />
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

export default RulesTab;
