import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit, Trash2, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

const GamesTab = () => {
  const { toast } = useToast();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [formState, setFormState] = useState({ name: '', platform: '', description: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('games').select('*').order('name');
    if (error) {
      toast({ title: 'Erro ao buscar jogos', description: error.message, variant: 'destructive' });
    } else {
      setGames(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  useEffect(() => {
    if (currentGame) {
      setFormState({ name: currentGame.name, platform: currentGame.platform, description: currentGame.description || '', image_url: currentGame.image_url });
    } else {
      setFormState({ name: '', platform: '', description: '', image_url: '' });
    }
    setImageFile(null);
  }, [currentGame, isFormOpen]);

  const handleEdit = (game) => { setCurrentGame(game); setIsFormOpen(true); };
  const handleAddNew = () => { setCurrentGame(null); setIsFormOpen(true); };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let imageUrlToSave = formState.image_url;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${formState.name.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      const filePath = `jogos/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('clan-assets').upload(filePath, imageFile, { upsert: true });

      if (uploadError) {
        toast({ title: 'Erro no upload da imagem', description: uploadError.message, variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }
      const { data } = supabase.storage.from('clan-assets').getPublicUrl(filePath);
      imageUrlToSave = data.publicUrl;
    }

    const { error } = await supabase.from('games').upsert({ id: currentGame?.id, ...formState, image_url: imageUrlToSave });
    
    if (error) {
      toast({ title: 'Erro ao salvar jogo', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso!', description: `Jogo ${currentGame ? 'atualizado' : 'adicionado'}.` });
      setIsFormOpen(false);
      fetchGames();
    }
    setIsSubmitting(false);
  };
  
  const handleDelete = async (id) => {
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Jogo deletado' });
      fetchGames();
    }
  };

  return (
    <div className="bg-wkz-gray p-8 rounded-2xl border border-wkz-white/10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron font-bold text-2xl text-wkz-white">Gerenciar Jogos</h2>
        <Button onClick={handleAddNew} className="btn-primary"><Plus className="mr-2" size={18} /> Adicionar Jogo</Button>
      </div>
      
      <div className="divide-y divide-wkz-white/10">
        {loading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div> :
        games.map((game) => (
          <div key={game.id} className="flex items-center justify-between p-4 first:pt-0 last:pb-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg bg-wkz-black/50 flex items-center justify-center">
                {game.image_url ? <img src={game.image_url} alt={game.name} className="w-full h-full object-cover rounded-lg" /> : <ImageIcon className="text-wkz-white/40" />}
              </div>
              <div>
                <h3 className="text-wkz-white font-semibold">{game.name}</h3>
                <p className="text-wkz-white/60 text-sm">{game.platform}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost" onClick={() => handleEdit(game)}><Edit size={16} /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-wkz-red hover:text-wkz-red/80 hover:bg-wkz-red/10"><Trash2 size={16} /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle><AlertDialogDescription>Isso irá deletar permanentemente o jogo {game.name}.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(game.id)}>Deletar</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentGame ? 'Editar' : 'Adicionar'} Jogo</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="mt-1 bg-wkz-black/50" required />
            </div>
            <div>
              <label className="text-sm font-medium">Plataforma</label>
              <Input value={formState.platform} onChange={e => setFormState({...formState, platform: e.target.value})} className="mt-1 bg-wkz-black/50" placeholder="PC, Mobile, Console" required />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} className="mt-1 bg-wkz-black/50" />
            </div>
            <div>
              <label className="text-sm font-medium">Imagem (opcional)</label>
              <div className="flex items-center space-x-4 mt-1">
                <div className="w-16 h-16 rounded-lg bg-wkz-black/50 flex items-center justify-center border border-dashed">
                  {imageFile ? <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover rounded-lg"/> : formState.image_url ? <img src={formState.image_url} alt="Imagem atual" className="w-full h-full object-cover rounded-lg"/> : <ImageIcon className="text-wkz-white/40"/>}
                </div>
                <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="bg-wkz-black/50" />
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

export default GamesTab;