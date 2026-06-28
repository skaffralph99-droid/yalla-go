import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, radius, categoryIcons } from '../../src/lib/theme';
export default function PointsScreen() {
  const [rewards, setRewards] = useState([]); const [refreshing, setRefreshing] = useState(false);
  const { user, profile } = useAuth();
  const load = async()=>{const{data}=await supabase.from('rewards').select('*,stores(name,category,reward_name,reward_visits_required)').eq('user_id',user.id).order('visit_count',{ascending:false});setRewards(data||[]);};
  useEffect(()=>{load();},[]);
  const onRefresh=useCallback(async()=>{setRefreshing(true);await load();setRefreshing(false);},[]);
  return(<SafeAreaView style={s.c}>
    <View style={s.hd}>
      <View><Text style={s.title}>My Stamps ⭐</Text><Text style={s.sub}>Collect visits, earn rewards</Text></View>
      <View style={s.streakPill}><Text style={{fontSize:14}}>🔥</Text><Text style={s.streakNum}>{profile?.streak_count||0}</Text></View>
    </View>
    <FlatList data={rewards} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary}/>}
      renderItem={({item})=>{const st=item.stores;if(!st)return null;const p=item.visit_count-(item.redeemed_count*st.reward_visits_required);const pct=Math.min(p/st.reward_visits_required,1);const can=p>=st.reward_visits_required;return(
        <View style={s.stamp}>
          <View style={s.stampTop}>
            <View style={[s.stampIconWrap,can&&{backgroundColor:colors.accentGlow}]}><Text style={{fontSize:26}}>{categoryIcons[st.category]||'🏪'}</Text></View>
            <View style={{flex:1}}><Text style={s.stampN}>{st.name}</Text><Text style={s.stampR}>🎁 {st.reward_name}</Text></View>
            <View style={[s.countPill,can&&s.countPillReady]}><Text style={[s.countT,can&&s.countTReady]}>{p}/{st.reward_visits_required}</Text></View>
          </View>
          <View style={s.progBg}><View style={[s.progFill,{width:pct*100+'%'},can&&{backgroundColor:colors.accent}]}/></View>
          <View style={s.dotsRow}>{Array.from({length:st.reward_visits_required}).map((_,i)=>(<View key={i} style={[s.dot,i<p&&s.dotOn,i<p&&can&&{backgroundColor:colors.accent}]}>{i<p?<Text style={s.dotCheck}>✓</Text>:<Text style={s.dotNum}>{i+1}</Text>}</View>))}</View>
          {can&&<View style={s.readyBar}><Text style={s.readyT}>🎉 Reward Ready! Show to cashier</Text></View>}
        </View>);}}
      ListEmptyComponent={<View style={s.empty}><Text style={{fontSize:64}}>⭐</Text><Text style={s.emptyT}>No stamps yet!</Text><Text style={s.emptyS}>Visit a partner store to start your stamp card</Text></View>}/>
  </SafeAreaView>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  hd:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,paddingBottom:14},
  title:{fontSize:24,fontWeight:'900',color:colors.text},
  sub:{fontSize:13,color:colors.textDim,marginTop:2},
  streakPill:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#fff',borderRadius:radius.full,paddingHorizontal:14,paddingVertical:8,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.05,shadowRadius:4,elevation:2},
  streakNum:{fontSize:16,fontWeight:'900',color:colors.accent},
  stamp:{backgroundColor:'#fff',borderRadius:22,padding:18,marginBottom:14,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.06,shadowRadius:10,elevation:3},
  stampTop:{flexDirection:'row',alignItems:'center',marginBottom:14,gap:12},
  stampIconWrap:{width:52,height:52,borderRadius:16,backgroundColor:colors.bgSoft,justifyContent:'center',alignItems:'center'},
  stampN:{fontSize:16,fontWeight:'700',color:colors.text},
  stampR:{fontSize:12,color:colors.accent,marginTop:3,fontWeight:'600'},
  countPill:{backgroundColor:colors.bgSoft,borderRadius:12,paddingHorizontal:14,paddingVertical:7},
  countPillReady:{backgroundColor:colors.accentGlow,borderWidth:1.5,borderColor:colors.accent},
  countT:{fontSize:14,fontWeight:'800',color:colors.textDim},
  countTReady:{color:colors.accent},
  progBg:{height:5,backgroundColor:colors.bgSoft,borderRadius:3,overflow:'hidden',marginBottom:14},
  progFill:{height:'100%',backgroundColor:colors.primary,borderRadius:3},
  dotsRow:{flexDirection:'row',gap:7,flexWrap:'wrap',justifyContent:'center'},
  dot:{width:30,height:30,borderRadius:15,backgroundColor:colors.bgSoft,justifyContent:'center',alignItems:'center'},
  dotOn:{backgroundColor:colors.primary},
  dotCheck:{color:'#fff',fontSize:12,fontWeight:'900'},
  dotNum:{color:colors.textMuted,fontSize:10,fontWeight:'600'},
  readyBar:{backgroundColor:colors.accentGlow,borderRadius:14,padding:14,alignItems:'center',marginTop:14,borderWidth:1.5,borderColor:'rgba(249,115,22,0.3)'},
  readyT:{fontSize:15,fontWeight:'800',color:colors.accent},
  empty:{alignItems:'center',paddingTop:60},
  emptyT:{fontSize:22,fontWeight:'800',color:colors.text,marginTop:16},
  emptyS:{fontSize:14,color:colors.textDim,marginTop:6,textAlign:'center',paddingHorizontal:40},
});
