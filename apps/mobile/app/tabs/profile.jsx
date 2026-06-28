import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, radius } from '../../src/lib/theme';
export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth(); const [stats, setStats] = useState({v:0,p:0,s:0}); const router = useRouter();
  useEffect(()=>{supabase.from('stamps').select('points_earned,store_id').eq('user_id',user.id).then(({data})=>{if(data)setStats({v:data.length,p:data.reduce((a,b)=>a+b.points_earned,0),s:new Set(data.map(d=>d.store_id)).size});});},[]);
  return(<SafeAreaView style={s.c}><ScrollView showsVerticalScrollIndicator={false}>
    <View style={s.headerBg}>
      <View style={s.avOuter}><View style={s.av}><Text style={s.avT}>{(profile?.full_name||'U')[0].toUpperCase()}</Text></View></View>
      <Text style={s.name}>{profile?.full_name}</Text>
      <Text style={s.phone}>{profile?.phone}</Text>
    </View>
    <View style={s.streakRow}>
      <View style={s.streakCard}><Text style={{fontSize:28}}>🔥</Text><View><Text style={s.streakNum}>{profile?.streak_count||0} Day Streak</Text><Text style={s.streakSub}>Keep spinning daily!</Text></View></View>
    </View>
    <View style={s.grid}>
      <View style={[s.stat,{backgroundColor:colors.primaryGlow}]}><Text style={s.statEmoji}>🏪</Text><Text style={[s.statV,{color:colors.primary}]}>{stats.v}</Text><Text style={s.statL}>Visits</Text></View>
      <View style={[s.stat,{backgroundColor:colors.accentGlow}]}><Text style={s.statEmoji}>⚡</Text><Text style={[s.statV,{color:colors.accent}]}>{stats.p}</Text><Text style={s.statL}>Points</Text></View>
      <View style={[s.stat,{backgroundColor:'rgba(124,58,237,0.1)'}]}><Text style={s.statEmoji}>📍</Text><Text style={[s.statV,{color:colors.purple}]}>{stats.s}</Text><Text style={s.statL}>Stores</Text></View>
    </View>
    <View style={s.section}>
      <TouchableOpacity style={s.menuItem} onPress={()=>router.push('/pick-favorites')} activeOpacity={0.7}>
        <View style={[s.menuIcon,{backgroundColor:colors.primaryGlow}]}><Text style={{fontSize:20}}>⭐</Text></View>
        <View style={{flex:1}}><Text style={s.menuT}>Favorite Stores</Text><Text style={s.menuS}>Update your spin preferences</Text></View>
        <Text style={{color:colors.textMuted,fontSize:20}}>›</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.menuItem} activeOpacity={0.7}>
        <View style={[s.menuIcon,{backgroundColor:colors.accentGlow}]}><Text style={{fontSize:20}}>🏆</Text></View>
        <View style={{flex:1}}><Text style={s.menuT}>Weekly Draw</Text><Text style={s.menuS}>Win cash every Sunday</Text></View>
        <Text style={{color:colors.textMuted,fontSize:20}}>›</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={s.logout} onPress={()=>Alert.alert('Log Out','Are you sure?',[{text:'Cancel'},{text:'Log Out',style:'destructive',onPress:signOut}])} activeOpacity={0.7}>
      <Text style={s.logoutT}>Log Out</Text>
    </TouchableOpacity>
    <Text style={s.ver}>Yalla Go v1.0 · CraftCode Agency 🇱🇧</Text>
  </ScrollView></SafeAreaView>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  headerBg:{alignItems:'center',backgroundColor:colors.primary,paddingTop:24,paddingBottom:36,borderBottomLeftRadius:32,borderBottomRightRadius:32},
  avOuter:{width:100,height:100,borderRadius:50,backgroundColor:'rgba(255,255,255,0.2)',justifyContent:'center',alignItems:'center',marginBottom:14},
  av:{width:84,height:84,borderRadius:42,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'},
  avT:{fontSize:36,fontWeight:'900',color:colors.primary},
  name:{fontSize:24,fontWeight:'900',color:'#fff'},
  phone:{fontSize:14,color:'rgba(255,255,255,0.75)',marginTop:4},
  streakRow:{paddingHorizontal:20,marginTop:-20},
  streakCard:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:'#fff',borderRadius:20,paddingHorizontal:22,paddingVertical:16,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.08,shadowRadius:12,elevation:4},
  streakNum:{fontSize:18,fontWeight:'800',color:colors.accent},
  streakSub:{fontSize:12,color:colors.textDim,marginTop:2},
  grid:{flexDirection:'row',gap:10,paddingHorizontal:20,marginTop:20,marginBottom:20},
  stat:{flex:1,borderRadius:20,padding:16,alignItems:'center'},
  statEmoji:{fontSize:22,marginBottom:8},
  statV:{fontSize:28,fontWeight:'900'},
  statL:{fontSize:11,color:colors.textDim,marginTop:4,fontWeight:'600'},
  section:{paddingHorizontal:20,marginBottom:20,gap:10},
  menuItem:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:'#fff',borderRadius:18,padding:18,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.04,shadowRadius:6,elevation:2},
  menuIcon:{width:44,height:44,borderRadius:14,justifyContent:'center',alignItems:'center'},
  menuT:{fontSize:16,fontWeight:'700',color:colors.text},
  menuS:{fontSize:12,color:colors.textDim,marginTop:2},
  logout:{marginHorizontal:20,padding:16,borderRadius:16,backgroundColor:'rgba(239,68,68,0.06)',borderWidth:1.5,borderColor:'rgba(239,68,68,0.15)',alignItems:'center',marginBottom:14},
  logoutT:{color:colors.red,fontWeight:'700',fontSize:15},
  ver:{textAlign:'center',fontSize:12,color:colors.textMuted,marginBottom:40},
});
