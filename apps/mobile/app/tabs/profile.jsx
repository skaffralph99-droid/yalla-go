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
    <View style={s.top}>
      <View style={s.avOuter}><View style={s.av}><Text style={s.avT}>{(profile?.full_name||'U')[0].toUpperCase()}</Text></View></View>
      <Text style={s.name}>{profile?.full_name}</Text>
      <Text style={s.phone}>{profile?.phone}</Text>
      <View style={s.streakCard}>
        <Text style={{fontSize:20}}>🔥</Text>
        <View><Text style={s.streakNum}>{profile?.streak_count||0} Day Streak</Text><Text style={s.streakSub}>Keep spinning daily!</Text></View>
      </View>
    </View>
    <View style={s.grid}>
      <View style={s.stat}><Text style={s.statEmoji}>🏪</Text><Text style={s.statV}>{stats.v}</Text><Text style={s.statL}>Visits</Text></View>
      <View style={s.stat}><Text style={s.statEmoji}>⚡</Text><Text style={[s.statV,{color:colors.tealLight}]}>{stats.p}</Text><Text style={s.statL}>Points</Text></View>
      <View style={s.stat}><Text style={s.statEmoji}>📍</Text><Text style={[s.statV,{color:colors.goldLight}]}>{stats.s}</Text><Text style={s.statL}>Stores</Text></View>
    </View>
    <View style={s.section}>
      <TouchableOpacity style={s.menu} onPress={()=>router.push('/pick-favorites')} activeOpacity={0.7}>
        <View style={s.menuIcon}><Text style={{fontSize:18}}>⭐</Text></View>
        <View style={{flex:1}}><Text style={s.menuT}>Favorite Stores</Text><Text style={s.menuS}>Update your spin preferences</Text></View>
        <Text style={{color:colors.textMuted,fontSize:18}}>›</Text>
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
  top:{alignItems:'center',paddingTop:20,paddingBottom:24,paddingHorizontal:20},
  avOuter:{width:96,height:96,borderRadius:48,backgroundColor:colors.tealGlowStrong,justifyContent:'center',alignItems:'center',marginBottom:16},
  av:{width:80,height:80,borderRadius:40,backgroundColor:colors.teal,justifyContent:'center',alignItems:'center'},
  avT:{fontSize:32,fontWeight:'800',color:'#fff'},
  name:{fontSize:24,fontWeight:'800',color:colors.text,letterSpacing:-0.5},
  phone:{fontSize:14,color:colors.textDim,marginTop:4},
  streakCard:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:colors.bgCard,borderRadius:16,paddingHorizontal:20,paddingVertical:14,marginTop:20,borderWidth:1,borderColor:colors.border,width:'100%'},
  streakNum:{fontSize:16,fontWeight:'700',color:colors.goldLight},
  streakSub:{fontSize:12,color:colors.textMuted,marginTop:2},
  grid:{flexDirection:'row',gap:10,paddingHorizontal:20,marginBottom:24},
  stat:{flex:1,backgroundColor:colors.bgCard,borderRadius:18,padding:16,alignItems:'center',borderWidth:1,borderColor:colors.border},
  statEmoji:{fontSize:20,marginBottom:8},
  statV:{fontSize:28,fontWeight:'800',color:colors.text},
  statL:{fontSize:11,color:colors.textDim,marginTop:4,fontWeight:'600'},
  section:{paddingHorizontal:20,marginBottom:24},
  menu:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:colors.bgCard,borderRadius:18,padding:18,borderWidth:1,borderColor:colors.border},
  menuIcon:{width:40,height:40,borderRadius:12,backgroundColor:colors.bgElevated,justifyContent:'center',alignItems:'center'},
  menuT:{fontSize:16,fontWeight:'600',color:colors.text},
  menuS:{fontSize:12,color:colors.textDim,marginTop:2},
  logout:{marginHorizontal:20,padding:16,borderRadius:16,borderWidth:1,borderColor:'rgba(239,68,68,0.2)',backgroundColor:'rgba(239,68,68,0.06)',alignItems:'center',marginBottom:16},
  logoutT:{color:colors.red,fontWeight:'700',fontSize:15},
  ver:{textAlign:'center',fontSize:12,color:colors.textMuted,marginBottom:40},
});
