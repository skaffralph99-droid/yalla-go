import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius, categoryIcons } from '../../src/lib/theme';
export default function PointsScreen() {
  const [rewards, setRewards] = useState([]); const [refreshing, setRefreshing] = useState(false);
  const { user, profile } = useAuth();
  const load = async()=>{const{data}=await supabase.from('rewards').select('*,stores(name,category,reward_name,reward_visits_required)').eq('user_id',user.id).order('visit_count',{ascending:false});setRewards(data||[]);};
  useEffect(()=>{load();},[]);
  const onRefresh=useCallback(async()=>{setRefreshing(true);await load();setRefreshing(false);},[]);
  return(<SafeAreaView style={s.c}>
    <View style={s.hd}>
      <View><Text style={s.title}>My Stamps</Text><Text style={s.sub}>Your reward progress</Text></View>
      <View style={s.streakBadge}><Text style={{fontSize:14}}>🔥</Text><Text style={s.streakNum}>{profile?.streak_count||0}</Text></View>
    </View>
    <FlatList data={rewards} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tealLight}/>}
      renderItem={({item})=>{const st=item.stores;if(!st)return null;const p=item.visit_count-(item.redeemed_count*st.reward_visits_required);const pct=Math.min(p/st.reward_visits_required,1);const can=p>=st.reward_visits_required;return(
        <View style={s.stamp}>
          <View style={s.stampTop}>
            <View style={s.stampIcon}><Text style={{fontSize:24}}>{categoryIcons[st.category]||'🏪'}</Text></View>
            <View style={{flex:1}}><Text style={s.stampN}>{st.name}</Text><Text style={s.stampR}>{st.reward_name}</Text></View>
            <View style={[s.countBadge,can&&s.countBadgeReady]}><Text style={[s.countText,can&&s.countTextReady]}>{p}/{st.reward_visits_required}</Text></View>
          </View>
          <View style={s.progBg}><View style={[s.progFill,{width:pct*100+'%'},can&&{backgroundColor:colors.goldLight}]}/></View>
          <View style={s.dotsRow}>{Array.from({length:st.reward_visits_required}).map((_,i)=>(<View key={i} style={[s.dot,i<p&&s.dotOn]}>{i<p&&<Text style={s.dotCheck}>✓</Text>}</View>))}</View>
          {can&&<View style={s.readyBanner}><Text style={s.readyText}>🎁 Reward Ready! Show to cashier</Text></View>}
        </View>);}}
      ListEmptyComponent={<View style={s.empty}><Text style={{fontSize:56}}>⭐</Text><Text style={s.emptyT}>No stamps yet</Text><Text style={s.emptyS}>Visit a partner store to start collecting!</Text></View>}/>
  </SafeAreaView>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  hd:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,paddingBottom:12},
  title:{fontSize:24,fontWeight:'800',color:colors.text,letterSpacing:-0.5},
  sub:{fontSize:13,color:colors.textDim,marginTop:2},
  streakBadge:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:colors.bgCard,borderRadius:radius.full,paddingHorizontal:14,paddingVertical:8,borderWidth:1,borderColor:colors.border},
  streakNum:{fontSize:16,fontWeight:'800',color:colors.goldLight},
  stamp:{backgroundColor:colors.bgCard,borderRadius:20,padding:18,marginBottom:12,borderWidth:1,borderColor:colors.border},
  stampTop:{flexDirection:'row',alignItems:'center',marginBottom:14,gap:12},
  stampIcon:{width:48,height:48,borderRadius:14,backgroundColor:colors.bgElevated,justifyContent:'center',alignItems:'center'},
  stampN:{fontSize:16,fontWeight:'700',color:colors.text},
  stampR:{fontSize:12,color:colors.goldLight,marginTop:2},
  countBadge:{backgroundColor:colors.bgElevated,borderRadius:10,paddingHorizontal:12,paddingVertical:6},
  countBadgeReady:{backgroundColor:colors.goldGlow,borderWidth:1,borderColor:colors.gold},
  countText:{fontSize:14,fontWeight:'700',color:colors.textDim},
  countTextReady:{color:colors.goldLight},
  progBg:{height:4,backgroundColor:colors.bgElevated,borderRadius:2,overflow:'hidden',marginBottom:14},
  progFill:{height:'100%',backgroundColor:colors.tealLight,borderRadius:2},
  dotsRow:{flexDirection:'row',gap:6,flexWrap:'wrap'},
  dot:{width:28,height:28,borderRadius:14,borderWidth:1.5,borderColor:colors.borderLight,justifyContent:'center',alignItems:'center',backgroundColor:colors.bgElevated},
  dotOn:{backgroundColor:colors.teal,borderColor:colors.teal},
  dotCheck:{color:'#fff',fontSize:11,fontWeight:'800'},
  readyBanner:{backgroundColor:colors.goldGlow,borderRadius:12,padding:12,alignItems:'center',marginTop:14,borderWidth:1,borderColor:'rgba(245,158,11,0.3)'},
  readyText:{fontSize:14,fontWeight:'700',color:colors.goldLight},
  empty:{alignItems:'center',paddingTop:60},
  emptyT:{fontSize:20,fontWeight:'700',color:colors.textDim,marginTop:12},
  emptyS:{fontSize:13,color:colors.textMuted,marginTop:4},
});
