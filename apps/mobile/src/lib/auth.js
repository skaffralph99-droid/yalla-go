import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
const AuthContext = createContext({});
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchProfile = async (uid) => { const { data } = await supabase.from('profiles').select('*').eq('id', uid).single(); setProfile(data); return data; };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); if (session?.user) fetchProfile(session.user.id); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { setUser(session?.user ?? null); if (session?.user) fetchProfile(session.user.id); else setProfile(null); });
    return () => subscription.unsubscribe();
  }, []);
  const signInWithPhone = async (phone) => await supabase.auth.signInWithOtp({ phone });
  const verifyOtp = async (phone, token, fullName) => await supabase.auth.verifyOtp({ phone, token, type: 'sms', options: { data: { full_name: fullName } } });
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };
  const refreshProfile = async () => { if (user) return fetchProfile(user.id); };
  return (<AuthContext.Provider value={{ user, profile, loading, signInWithPhone, verifyOtp, signOut, refreshProfile }}>{children}</AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);
