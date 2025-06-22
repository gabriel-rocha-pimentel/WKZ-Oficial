
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

const ContactsTab = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [formState, setFormState] = useState({ type: '', value: '', is_active: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contacts').select('*').order('created_at');
    if (error) {
      toast({ title: 'Erro ao buscar contatos', description: error.message, variant: 'destructive' });
    } else {
      setContacts(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    if (currentContact) {
      setFormState({
        type: currentContact.type,
        value: currentContact.value,
        is_active: currentContact.is_active,
      });
    } else {
      setFormState({ type: '', value: '', is_active: true });
    }
  }, [currentContact]);

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setCurrentContact(null);
    setIsFormOpen(true);
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('contacts').upsert({ id: currentContact?.id, ...formState });
    
    if (error) {
      toast({ title: 'Erro ao salvar contato', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso!', description: `Contato ${currentContact ? 'atualizado' : 'adicionado'}.` });
      setIsFormOpen(false);
      fetchContacts();
    }
    setIsSubmitting(false);
  };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Contato deletado' });
      fetchContacts();
    }
  };

  const handleToggleActive = async (contact) => {
    const { error } = await supabase.from('contacts').update({ is_active: !contact.is_active }).eq('id', contact.id);
     if (error) {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Status do contato atualizado' });
      fetchContacts();
    }
  }

  return (
    <div className="bg-wkz-gray p-8 rounded-2xl border border-wkz-white/10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron font-bold text-2xl text-wkz-white">Gerenciar Contatos</h2>
        <Button onClick={handleAddNew} className="btn-primary"><Plus className="mr-2" size={18} /> Adicionar Contato</Button>
      </div>
      
      <div className="divide-y divide-wkz-white/10">
        {loading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div> :
        contacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between p-4 first:pt-0 last:pb-0">
            <div>
              <h3 className="text-wkz-white font-semibold">{contact.type}</h3>
              <p className="text-wkz-white/60 text-sm">{contact.value}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch checked={contact.is_active} onCheckedChange={() => handleToggleActive(contact)} />
                <span className="text-sm text-wkz-white/80">{contact.is_active ? 'Ativo' : 'Inativo'}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleEdit(contact)}><Edit size={16} /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-wkz-red hover:text-wkz-red/80 hover:bg-wkz-red/10"><Trash2 size={16} /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá deletar permanentemente o contato.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(contact.id)}>Deletar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentContact ? 'Editar' : 'Adicionar'} Contato</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-wkz-white/80">Tipo (ex: WhatsApp, Discord)</label>
              <Input value={formState.type} onChange={e => setFormState({...formState, type: e.target.value})} className="mt-1 bg-wkz-black/50" required />
            </div>
            <div>
              <label className="text-sm font-medium text-wkz-white/80">Valor (link ou número)</label>
              <Input value={formState.value} onChange={e => setFormState({...formState, value: e.target.value})} className="mt-1 bg-wkz-black/50" required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={formState.is_active} onCheckedChange={checked => setFormState({...formState, is_active: checked})} />
              <label htmlFor="is_active">Contato Ativo</label>
            </div>
            <DialogFooter>
              <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsTab;
