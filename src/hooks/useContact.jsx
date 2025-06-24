import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Mail, MessageSquare, Share2, Phone } from 'lucide-react';

// Hook para lógica da página de contato
export function useContact() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('contacts')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at');
                if (error) throw error;
                setContacts(data);
            } catch (error) {
                toast({
                    title: "Erro ao carregar contatos",
                    description: "Não foi possível buscar os contatos.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [toast]);

    // Retorna o ícone apropriado para o tipo de contato
    const getContactIcon = (type) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('mail')) return <Mail size={28} className="text-wkz-yellow" />;
        if (lowerType.includes('whatsapp')) return <MessageSquare size={28} className="text-wkz-yellow" />;
        if (lowerType.includes('discord')) return <Share2 size={28} className="text-wkz-yellow" />;
        return <Phone size={28} className="text-wkz-yellow" />;
    };

    // Gera a URL correta para cada tipo de contato
    const getContactUrl = (contact) => {
        const type = contact.type.toLowerCase();
        const value = contact.value;
        if (type.includes('mail')) {
            return `http://mailto:${value}`;
        }
        if (type.includes('whatsapp')) {
            const phone = value.replace(/\D/g, '');
            return `https://api.whatsapp.com/send?phone=${phone}`;
        }
        if (type.includes('discord')) {
            if (value.startsWith('http')) {
                return value;
            }
            return `https://discord.gg/${value}`;
        }
        if (type.includes('telegram')) {
            if (value.startsWith('http')) {
                return value;
            }
            return `https://t.me/${value.replace('@', '')}`;
        }
        if (type.includes('instagram')) {
            if (value.startsWith('http')) {
                return value;
            }
            return `https://instagram.com/${value.replace('@', '')}`;
        }
        if (type.includes('twitter') || type.includes('x.com')) {
            if (value.startsWith('http')) {
                return value;
            }
            return `https://twitter.com/${value.replace('@', '')}`;
        }
        if (type.includes('facebook')) {
            if (value.startsWith('http')) {
                return value;
            }
            return `https://facebook.com/${value}`;
        }
        if (value.startsWith('http')) {
            return value;
        }
        return '#';
    };

    return {
        contacts,
        loading,
        getContactIcon,
        getContactUrl
    };
}