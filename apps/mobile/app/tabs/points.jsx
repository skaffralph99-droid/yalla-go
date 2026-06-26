import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius, categoryIcons } from '../../src/lib/theme';
export default function PointsScreen() {
  const [rewards, setRewards] = useState([]); const [entries, setEntries] = useState(0); const [refreshing, setRefreshing] = useState(false);
  const { user, profile } = useAuth();
  const load = async()=>{const{data:rw}=await supabase.from('rewards').select('*,stores(name,category,reward_name,reward_visits_required)').eq('user_id',user.id).order('visit_count',{ascending:false});setRewards(rw||[]);};
  useEffect(()=>{load();},[]);
  const onRefresh=useCallback(async()=>{setRefreshing(true);await load();setRefreshing(false);},[]);
  return(<SafeAreaView style={s.c}>
    <View style={s.hd}><Text style={s.title}>My Points</Text><View style={s.pill}><Text style={s.pillT}>🔥 {profile?.streak_count||0}</Text></View></View>
    <FlatList data={rewards} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:24,paddingBottom:100}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal}/>}
      renderItem={({item})=>{const st=item.stores;if(!st)return null;const p=item.visit_count-(item.redeemed_count*st.reward_visits_required);const pct=Math.min(p/st.reward_visits_required,1);return(
        <View style={s.stamp}><View style={s.stampH}><Text style={{fontSize:28,marginRight:8}}>{categoryIcons[st.category]||'🏪'}</Text><View style={{flex:1}}><Text style={s.stampN}>{st.name}</Text><Text style={s.stampR}>{st.reward_name}</Text></View><Text style={s.stampC}>{p}/{st.reward_visits_required}</Text></View>
        <View style={s.progBg}><View style={[s.progFill,{width:pct*100+'%'}]}/></View></View>);}}
      ListEmptyComponent={<View style={{alignItems:'center',paddingTop:48}}><Text style={{fontSize:48}}>⭐</Text><Text style={{fontSize:18,fontWeight:'600',color:colors.textDim,marginTop:8}}>No stamps yet</Text><Text style={{fontSize:13,color:colors.textMuted,marginTop:4}}>Visit a store and get scanned!</Text></View>}/>
  </SafeAreaView>);
}
const s = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bg}, hd:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:24,paddingBottom:16}, title:{fontSize:24,fontWeight:'700',color:colors.text}, pill:{backgroundColor:colors.bgCard,borderRadius:999,paddingHorizontal:14,paddingVertical:6,borderWidth:1,borderColor:colors.border}, pillT:{fontSize:14,fontWeight:'600',color:colors.gold}, stamp:{backgroundColor:colors.bgCard,borderRadius:14,padding:16,marginBottom:8,borderWidth:1,borderColor:colors.border}, stampH:{flexDirection:'row',alignItems:'center',marginBottom:8}, stampN:{fontSize:15,fontWeight:'600',color:colors.text}, stampR:{fontSize:12,color:colors.goldLight,marginTop:2}, stampC:{fontSize:16,fontWeight:'700',color:colors.tealLight}, progBg:{height:6,backgroundColor:colors.bgElevated,borderRadius:3,overflow:'hidden'}, progFill:{height:'100%',backgroundColor:colors.teal,borderRadius:3} });
