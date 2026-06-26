import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/lib/auth';
import { supabase } from '../src/lib/supabase';
import { colors } from '../src/lib/theme';
export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    supabase.from('user_favorites').select('id').eq('user_id', user.id).then(({ data }) => { router.replace(!data || data.length === 0 ? '/pick-favorites' : '/tabs'); });
  }, [user, loading]);
  return (<View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={colors.teal} /></View>);
}
