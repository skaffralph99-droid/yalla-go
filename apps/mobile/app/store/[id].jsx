import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius, categoryIcons, categoryLabels } from '../../src/lib/theme';
export default function StoreScreen() {
  const { id } = useLocalSearchParams(); const { user } = useAuth(); const router = useRouter();
  const [store, setStore] = useState(null); const [reward, setReward] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(()=>{Promise.all([supabase.from('stores').select('*').eq('id',id).single(),supabase.from('rewards').select('*').eq('user_id',user.id).eq('store_id',id).single()]).then(([sr,rr])=>{setStore(sr.data);setReward(rr.data);setLoading(false);});},[id]);
  if(loading||!store)return<View style={[s.c,{justifyContent:'center',alignItems:'center'}]}><ActivityIndicator size='large' color={colors.teal}/></View>;
  const p=reward?reward.visit_count-(reward.redeemed_count*store.reward_visits_required):0;
  const pct=Math.min(p/store.reward_visits_required,1);
  return(<SafeAreaView style={s.c}><ScrollView>
    <TouchableOpacity style={{padding:24,paddingBottom:0}} onPress={()=>router.back()}><Text style={{fontSize:15,color:colors.tealLight,fontWeight:'500'}}>Back</Text></TouchableOpacity>
    <View style={s.hd}><Text style={{fontSize:56,marginBottom:8}}>{categoryIcons[store.category]||'🏪'}</Text><Text style={s.name}>{store.name}</Text><Text style={s.ar}>{store.name_ar}</Text>
    <View style={s.badges}><View style={s.badge}><Text style={s.badgeT}>{categoryLabels[store.category]} Tier {store.tier}</Text></View><View style={[s.badge,s.bt]}><Text style={s.btt}>+{store.points_per_visit} pts/visit</Text></View></View></View>
    <View style={s.rw}><Text style={s.rwT}>{store.reward_name}</Text><Text style={s.rwA}>{store.reward_name_ar}</Text><Text style={s.rwP}>{p} / {store.reward_visits_required} visits</Text><View style={s.pb}><View style={[s.pf,{width:pct*100+'%'}]}/></View></View>
    {store.phone&&<TouchableOpacity style={s.ph} onPress={()=>Linking.openURL('tel:'+store.phone)}><Text style={s.phT}>Call {store.phone}</Text></TouchableOpacity>}
    <TouchableOpacity style={s.qr} onPress={()=>router.push('/tabs/qr')}><Text style={s.qrT}>Show My QR Code</Text></TouchableOpacity>
    <View style={{height:40}}/>
  </ScrollView></SafeAreaView>);
}
const s=StyleSheet.create({c:{flex:1,backgroundColor:colors.bg},hd:{alignItems:'center',padding:24},name:{fontSize:26,fontWeight:'700',color:colors.text,textAlign:'center'},ar:{fontSize:16,color:colors.textDim,marginTop:4},badges:{flexDirection:'row',gap:8,marginTop:16},badge:{backgroundColor:colors.bgCard,borderRadius:999,paddingHorizontal:12,paddingVertical:6,borderWidth:1,borderColor:colors.border},badgeT:{fontSize:12,color:colors.textDim},bt:{borderColor:colors.teal,backgroundColor:colors.tealGlow},btt:{fontSize:12,color:colors.tealLight,fontWeight:'600'},rw:{backgroundColor:colors.bgCard,borderRadius:20,padding:24,marginHorizontal:24,marginBottom:16,borderWidth:1,borderColor:colors.border},rwT:{fontSize:18,fontWeight:'700',color:colors.gold},rwA:{fontSize:14,color:colors.textDim,marginTop:2},rwP:{fontSize:14,fontWeight:'600',color:colors.tealLight,marginTop:16,marginBottom:8},pb:{height:8,backgroundColor:colors.bgElevated,borderRadius:4,overflow:'hidden',marginBottom:16},pf:{height:'100%',backgroundColor:colors.teal,borderRadius:4},ph:{marginHorizontal:24,padding:16,backgroundColor:colors.bgCard,borderRadius:14,alignItems:'center',borderWidth:1,borderColor:colors.border,marginBottom:8},phT:{fontSize:15,fontWeight:'500',color:colors.text},qr:{marginHorizontal:24,padding:16,backgroundColor:colors.teal,borderRadius:14,alignItems:'center'},qrT:{fontSize:16,fontWeight:'600',color:'#fff'}});
