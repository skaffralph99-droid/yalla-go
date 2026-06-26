import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius } from '../../src/lib/theme';
export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth(); const [stats, setStats] = useState({v:0,p:0,s:0}); const router = useRouter();
  useEffect(()=>{supabase.from('stamps').select('points_earned,store_id').eq('user_id',user.id).then(({data})=>{if(data)setStats({v:data.length,p:data.reduce((a,b)=>a+b.points_earned,0),s:new Set(data.map(d=>d.store_id)).size});});},[]);
  return(<SafeAreaView style={s.c}><ScrollView showsVerticalScrollIndicator={false}>
    <View style={s.top}><View style={s.av}><Text style={s.avT}>{(profile?.full_name||'U')[0].toUpperCase()}</Text></View><Text style={s.name}>{profile?.full_name}</Text><Text style={s.phone}>{profile?.phone}</Text><View style={s.pill}><Text style={s.pillT}>🔥 {profile?.streak_count||0} day streak</Text></View></View>
    <View style={s.grid}><View style={s.stat}><Text style={s.statV}>{stats.v}</Text><Text style={s.statL}>Visits</Text></View><View style={s.stat}><Text style={[s.statV,{color:colors.tealLight}]}>{stats.p}</Text><Text style={s.statL}>Points</Text></View><View style={s.stat}><Text style={[s.statV,{color:colors.gold}]}>{stats.s}</Text><Text style={s.statL}>Stores</Text></View></View>
    <View style={{paddingHorizontal:24,marginBottom:24}}><TouchableOpacity style={s.menu} onPress={()=>router.push('/pick-favorites')}><Text style={{fontSize:20}}>⭐</Text><Text style={s.menuT}>Edit Favorite Stores</Text><Text style={{color:colors.textMuted}}>→</Text></TouchableOpacity></View>
    <TouchableOpacity style={s.logout} onPress={()=>Alert.alert('Log Out','Sure?',[{text:'Cancel'},{text:'Log Out',style:'destructive',onPress:signOut}])}><Text style={s.logoutT}>Log Out</Text></TouchableOpacity>
    <Text style={s.ver}>Yalla Go v1.0.0 - CraftCode Agency</Text>
  </ScrollView></SafeAreaView>);
}
const s = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bg}, top:{alignItems:'center',padding:32,paddingBottom:24}, av:{width:80,height:80,borderRadius:40,backgroundColor:colors.teal,justifyContent:'center',alignItems:'center',marginBottom:16}, avT:{fontSize:32,fontWeight:'700',color:'#fff'}, name:{fontSize:22,fontWeight:'700',color:colors.text}, phone:{fontSize:14,color:colors.textDim,marginTop:4}, pill:{backgroundColor:colors.bgCard,borderRadius:999,paddingHorizontal:16,paddingVertical:6,marginTop:16,borderWidth:1,borderColor:colors.border}, pillT:{fontSize:14,fontWeight:'600',color:colors.gold}, grid:{flexDirection:'row',gap:8,paddingHorizontal:24,marginBottom:24}, stat:{flex:1,backgroundColor:colors.bgCard,borderRadius:14,padding:16,alignItems:'center',borderWidth:1,borderColor:colors.border}, statV:{fontSize:24,fontWeight:'700',color:colors.text}, statL:{fontSize:11,color:colors.textDim,marginTop:4}, menu:{flexDirection:'row',alignItems:'center',gap:8,backgroundColor:colors.bgCard,borderRadius:14,padding:16,borderWidth:1,borderColor:colors.border}, menuT:{flex:1,fontSize:15,fontWeight:'500',color:colors.text}, logout:{marginHorizontal:24,padding:16,borderRadius:14,borderWidth:1,borderColor:'rgba(239,68,68,0.3)',alignItems:'center',marginBottom:16}, logoutT:{color:colors.red,fontWeight:'600',fontSize:15}, ver:{textAlign:'center',fontSize:12,color:colors.textMuted,marginBottom:40} });
