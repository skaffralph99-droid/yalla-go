import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, radius } from '../../src/lib/theme';
export default function SpinScreen() {
  const [result, setResult] = useState(null); const [already, setAlready] = useState(false); const [today, setToday] = useState(null); const [spinning, setSpinning] = useState(false); const [streak, setStreak] = useState(0);
  const rot = useRef(new Animated.Value(0)).current; const sc = useRef(new Animated.Value(1)).current;
  const { user, profile, refreshProfile } = useAuth();
  useEffect(()=>{const d=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Beirut'});supabase.from('daily_spins').select('*,stores(name,name_ar)').eq('user_id',user.id).eq('spin_date',d).single().then(({data})=>{if(data){setAlready(true);setToday(data);}});setStreak(profile?.streak_count||0);},[]);
  const handleSpin = async()=>{setSpinning(true);Animated.sequence([Animated.timing(rot,{toValue:8,duration:2500,useNativeDriver:true}),Animated.spring(sc,{toValue:1.2,useNativeDriver:true}),Animated.spring(sc,{toValue:1,useNativeDriver:true})]).start();const{data,error}=await supabase.rpc('do_daily_spin',{p_user_id:user.id});setTimeout(()=>{setSpinning(false);if(error||!data?.success){Alert.alert('Oops',data?.error||error?.message||'Failed');return;}setResult(data);setAlready(true);setStreak(data.streak_count);refreshProfile();},2800);};
  const rotation=rot.interpolate({inputRange:[0,8],outputRange:['0deg','2880deg']});
  const mc=(m)=>m===10?colors.red:m===5?colors.accent:m===3?colors.purple:colors.primary;
  const bg=(m)=>m===10?'rgba(239,68,68,0.1)':m===5?colors.accentGlow:m===3?'rgba(124,58,237,0.1)':colors.primaryGlow;
  return(<SafeAreaView style={s.c}><ScrollViewImport style={s.inner}>
    <View style={s.topBar}>
      <View style={s.streakCard}><Text style={{fontSize:20}}>🔥</Text><Text style={s.streakNum}>{streak}</Text><Text style={s.streakLabel}>day streak</Text></View>
    </View>
    <Text style={s.title}>Daily Spin 🎰</Text>
    <Text style={s.sub}>{already?'Come back tomorrow for another spin!':'Tap the wheel to win a boost!'}</Text>
    <View style={s.wheelOuter}>
      <View style={s.wheelRing}>
        <Animated.View style={{transform:[{rotate:rotation},{scale:sc}]}}><Text style={{fontSize:88}}>🎰</Text></Animated.View>
      </View>
    </View>
    {result?(<View style={[s.resultCard,{borderColor:mc(result.multiplier)}]}>
      <View style={[s.resultBadge,{backgroundColor:bg(result.multiplier)}]}><Text style={[s.resultMult,{color:mc(result.multiplier)}]}>{result.multiplier}x</Text></View>
      <Text style={s.resultLabel}>BOOST AT</Text>
      <Text style={s.resultStore}>{result.store_name}</Text>
      <Text style={s.resultStoreAr}>{result.store_name_ar}</Text>
      <View style={s.resultTip}><Text style={s.resultTipT}>⚡ Visit today to use your boost!</Text></View>
    </View>)
    :already&&today?(<View style={[s.resultCard,{borderColor:mc(today.multiplier)}]}>
      <View style={[s.resultBadge,{backgroundColor:bg(today.multiplier)}]}><Text style={[s.resultMult,{color:mc(today.multiplier)}]}>{today.multiplier}x</Text></View>
      <Text style={s.resultStore}>{today.stores?.name}</Text>
      <Text style={s.resultStatus}>{today.used?'✅ Used today!':'⏳ Expires at midnight'}</Text>
    </View>)
    :(<TouchableOpacity style={[s.spinBtn,spinning&&{opacity:0.5}]} onPress={handleSpin} disabled={spinning||already} activeOpacity={0.8}>
      <Text style={s.spinBtnT}>{spinning?'Spinning...':'🎯 SPIN NOW!'}</Text>
    </TouchableOpacity>)}
    <Text style={s.oddsTitle}>Boost Chances</Text>
    <View style={s.oddsRow}>
      {[{m:'2x',p:'60%',c:colors.primary,b:colors.primaryGlow},{m:'3x',p:'25%',c:colors.purple,b:'rgba(124,58,237,0.1)'},{m:'5x',p:'10%',c:colors.accent,b:colors.accentGlow},{m:'10x',p:'5%',c:colors.red,b:'rgba(239,68,68,0.1)'}].map((o,i)=>(
        <View key={i} style={[s.oddCard,{backgroundColor:o.b}]}><Text style={[s.oddM,{color:o.c}]}>{o.m}</Text><Text style={s.oddP}>{o.p}</Text></View>))}
    </View>
  </ScrollViewImport></SafeAreaView>);
}
import { ScrollView as ScrollViewImport } from 'react-native';
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  inner:{flex:1,padding:20},
  topBar:{flexDirection:'row',justifyContent:'center',marginBottom:20},
  streakCard:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#fff',borderRadius:radius.full,paddingHorizontal:18,paddingVertical:10,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.06,shadowRadius:6,elevation:2},
  streakNum:{fontSize:20,fontWeight:'900',color:colors.accent},
  streakLabel:{fontSize:13,color:colors.textDim,fontWeight:'500'},
  title:{fontSize:28,fontWeight:'900',color:colors.text,textAlign:'center'},
  sub:{fontSize:14,color:colors.textDim,textAlign:'center',marginTop:6,marginBottom:28,lineHeight:20},
  wheelOuter:{alignItems:'center',marginBottom:32},
  wheelRing:{width:200,height:200,borderRadius:100,backgroundColor:'#fff',borderWidth:4,borderColor:colors.primary,justifyContent:'center',alignItems:'center',shadowColor:colors.primary,shadowOffset:{width:0,height:4},shadowOpacity:0.2,shadowRadius:16,elevation:6},
  resultCard:{backgroundColor:'#fff',borderRadius:24,padding:28,alignItems:'center',borderWidth:2,marginBottom:24,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.08,shadowRadius:12,elevation:4},
  resultBadge:{borderRadius:20,paddingHorizontal:28,paddingVertical:12,marginBottom:14},
  resultMult:{fontSize:44,fontWeight:'900'},
  resultLabel:{fontSize:11,fontWeight:'700',color:colors.textMuted,letterSpacing:3,marginBottom:4},
  resultStore:{fontSize:20,fontWeight:'800',color:colors.text,marginTop:4},
  resultStoreAr:{fontSize:14,color:colors.textDim,marginTop:4},
  resultTip:{backgroundColor:colors.primaryGlow,borderRadius:radius.full,paddingHorizontal:20,paddingVertical:10,marginTop:16},
  resultTipT:{fontSize:13,fontWeight:'700',color:colors.primary},
  resultStatus:{fontSize:14,color:colors.textDim,marginTop:12,fontWeight:'600'},
  spinBtn:{backgroundColor:colors.accent,borderRadius:24,paddingHorizontal:48,paddingVertical:22,alignSelf:'center',marginBottom:32,shadowColor:colors.accent,shadowOffset:{width:0,height:6},shadowOpacity:0.35,shadowRadius:12,elevation:6},
  spinBtnT:{fontSize:20,fontWeight:'900',color:'#fff',letterSpacing:1},
  oddsTitle:{fontSize:14,fontWeight:'700',color:colors.textDim,textAlign:'center',marginBottom:12,letterSpacing:1},
  oddsRow:{flexDirection:'row',gap:10},
  oddCard:{borderRadius:16,padding:14,alignItems:'center',flex:1},
  oddM:{fontSize:20,fontWeight:'900'},
  oddP:{fontSize:11,color:colors.textDim,marginTop:4,fontWeight:'600'},
});
