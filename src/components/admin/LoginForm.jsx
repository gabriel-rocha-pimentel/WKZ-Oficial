import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';

const LoginForm = () => {
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;

      toast({ title: "Login bem-sucedido!", description: "Bem-vindo ao painel." });
    } catch (error) {
      toast({ title: "Erro no login", description: error.message || "Credenciais inválidas.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="bg-wkz-gray p-8 rounded-2xl border border-wkz-red/20 shadow-2xl shadow-wkz-red/10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-wkz-red to-wkz-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={40} className="text-wkz-black" />
            </div>
            <h1 className="font-orbitron font-bold text-3xl text-wkz-white mb-2 uppercase">Painel Admin</h1>
            <p className="text-wkz-white/60">Acesso restrito à liderança.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-wkz-white/80 mb-2">Email</label>
              <Input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="h-12 rounded-lg bg-wkz-black/50 text-lg"
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-wkz-white/80 mb-2">Senha</label>
              <Input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="h-12 rounded-lg bg-wkz-black/50 text-lg"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" size="lg" className="w-full btn-primary h-14 text-lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <><User className="mr-2" size={20} /> Entrar</>}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-wkz-yellow/10 border border-wkz-yellow/20 rounded-lg">
            <p className="text-wkz-yellow text-sm text-center font-semibold">
              <Shield size={16} className="inline mr-2" />
              Área de alta segurança.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;