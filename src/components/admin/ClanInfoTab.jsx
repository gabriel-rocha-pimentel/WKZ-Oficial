
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

const ClanInfoTab = () => {
  const { toast } = useToast();
  const [clanInfo, setClanInfo] = useState({ name: '', description: '', logo_url: '' });
  const [infoId, setInfoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const fetchClanInfo = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('clan_info').select('*').limit(1).single();
      if (data) {
        setClanInfo({ name: data.name || '', description: data.description || '', logo_url: data.logo_url || '' });
        setInfoId(data.id);
      } else if (error && error.code !== 'PGRST116') {
        toast({ title: 'Erro ao buscar dados', description: error.message, variant: 'destructive' });
      }
      setLoading(false);
    };
    fetchClanInfo();
  }, [toast]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let logoUrlToSave = clanInfo.logo_url;

    if (logoFile) {
      setUploading(true);
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('clan-assets').upload(filePath, logoFile, { upsert: true });

      if (uploadError) {
        toast({ title: 'Erro no upload', description: uploadError.message, variant: 'destructive' });
        setSaving(false);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('clan-assets').getPublicUrl(filePath);
      logoUrlToSave = data.publicUrl;
      setUploading(false);
    }

    const updates = {
      id: infoId || crypto.randomUUID(),
      name: clanInfo.name,
      description: clanInfo.description,
      logo_url: logoUrlToSave,
    };

    const { error } = await supabase.from('clan_info').upsert(updates, { onConflict: 'id' }).select().single();

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso!', description: 'Informações do clã salvas.' });
      setClanInfo(prev => ({ ...prev, logo_url: logoUrlToSave }));
      if(!infoId) setInfoId(updates.id);
      setLogoFile(null);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-wkz-red" /></div>;
  }

  return (
    <form onSubmit={handleSave} className="bg-wkz-gray p-8 rounded-2xl border border-wkz-white/10 space-y-8">
      <h2 className="font-orbitron font-bold text-2xl text-wkz-white">Identidade do Clã</h2>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium text-wkz-white/80">Nome do Clã</label>
        <Input
          type="text"
          value={clanInfo.name}
          onChange={(e) => setClanInfo({ ...clanInfo, name: e.target.value })}
          className="h-12 rounded-lg bg-wkz-black/50"
          required
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-wkz-white/80">Logo do Clã</label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-xl bg-wkz-black/50 flex items-center justify-center border border-dashed border-wkz-white/20">
            {logoFile ? <img src={URL.createObjectURL(logoFile)} alt="Preview" className="w-full h-full object-cover rounded-xl"/> : clanInfo.logo_url ? <img src={clanInfo.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl"/> : <ImageIcon className="text-wkz-white/40"/>}
          </div>
          <label htmlFor="logo-upload" className="cursor-pointer">
            <div className="h-12 px-4 inline-flex items-center justify-center rounded-lg text-sm font-medium bg-wkz-black/50 text-wkz-white/80 border border-wkz-white/20 hover:bg-wkz-black">
              <Upload size={18} className="mr-2" />
              {uploading ? 'Enviando...' : logoFile ? 'Trocar Imagem' : 'Enviar Imagem'}
            </div>
            <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} disabled={saving} />
          </label>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium text-wkz-white/80">Texto Institucional (Descrição)</label>
        <Textarea
          rows={6}
          value={clanInfo.description}
          onChange={(e) => setClanInfo({ ...clanInfo, description: e.target.value })}
          className="p-4 bg-wkz-black/50 border-wkz-white/10 rounded-lg text-wkz-white/90 focus:ring-wkz-red focus:border-wkz-red transition"
          placeholder="Fale sobre o espírito amigável e a diversão no clã..."
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="btn-primary h-12 px-6" disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2" size={18} />}
          {uploading ? 'Enviando Imagem...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
};

export default ClanInfoTab;
