import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius } from '../../src/lib/theme';
export default function SpinScreen() {
  const [result, setResult] = useState(null); const [already, setAlready] = useState(false); const [today, setToday] = useState(null); const [spinning, setSpinning] = useState(false); const [streak, setStreak] = useState(0);
  const rot = useRef(new Animated.Value(0)).current; const sc = useRef(new Animated.Value(1)).current; const glow = useRef(new Animated.Value(0.3)).current;
  const { user, profile, refreshProfile } = useAuth();
  useEffect(()=>{
    const d=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Beirut'});
    supabase.from('daily_spins').select('*,stores(name,name_ar)').eq('user_id',user.id).eq('spin_date',d).single().then(({data})=>{if(data){setAlready(true);setToday(data);}});
    setStreak(profile?.streak_count||0);
    Animated.loop(Animated.sequence([Animated.timing(glow,{toValue:1,duration:2000,useNativeDriver:true}),Animated.timing(glow,{toValue:0.3,duration:2000,useNativeDriver:true})])).start();
  },[]);
  const handleSpin = async()=>{setSpinning(true);Animated.sequence([Animated.timing(rot,{toValue:8,duration:2500,useNativeDriver:true}),Animated.spring(sc,{toValue:1.2,useNativeDriver:true}),Animated.spring(sc,{toValue:1,useNativeDriver:true})]).start();const{data,error}=await supabase.rpc('do_daily_spin',{p_user_id:user.id});setTimeout(()=>{setSpinning(false);if(error||!data?.success){Alert.alert('Error',data?.error||error?.message||'Failed');return;}setResult(data);setAlready(true);setStreak(data.streak_count);refreshProfile();},2800);};
  const rotation=rot.interpolate({inputRange:[0,8],outputRange:['0deg','2880deg']});
  const mc=(m)=>m===10?'#EF4444':m===5?colors.goldLight:m===3?colors.tealBright:colors.textDim;
  return(<SafeAreaView style={s.c}><View style={s.inner}>
    <View style={s.topRow}>
      <View style={s.stk}><Text style={{fontSize:16}}>🔥</Text><Text style={s.stkT}>{streak}</Text></View>
      <Text style={s.title}>Daily Spin</Text>
      <View style={{width:50}}/>
    </View>
    <Text style={s.sub}>{already?'You already spun today!':'Your daily boost awaits'}</Text>
    <Animated.View style={[s.ww,{opacity:glow}]}>
      <View style={s.wwInner}>
        <Animated.View style={{transform:[{rotate:rotation},{scale:sc}]}}><Text style={{fontSize:80}}>🎰</Text></Animated.View>
      </View>
    </Animated.View>
    {result?(<View style={s.res}>
      <Text style={s.resLabel}>YOU GOT</Text>
      <Text style={[s.resMult,{color:mc(result.multiplier)}]}>{result.multiplier}x</Text>
      <Text style={s.resAt}>boost at</Text>
      <Text style={s.resStore}>{result.store_name}</Text>
      <View style={s.resTag}><Text style={s.resTagT}>Visit today to use it!</Text></View>
    </View>)
    :already&&today?(<View style={s.res}>
      <Text style={[s.resMult,{color:mc(today.multiplier)}]}>{today.multiplier}x</Text>
      <Text style={s.resStore}>{today.stores?.name}</Text>
      <Text style={s.resUsed}>{today.used?'✅ Used':'⏳ Visit before midnight!'}</Text>
    </View>)
    :(<TouchableOpacity style={[s.spinBtn,spinning&&{opacity:0.4}]} onPress={handleSpin} disabled={spinning||already} activeOpacity={0.8}>
      <Text style={s.spinT}>{spinning?'Spinning...':'SPIN NOW'}</Text>
    </TouchableOpacity>)}
    <View style={s.odds}>
      {[{m:'2x',p:'60%',c:colors.textDim},{m:'3x',p:'25%',c:colors.tealBright||colors.tealLight},{m:'5x',p:'10%',c:colors.goldLight},{m:'10x',p:'5%',c:'#EF4444'}].map((o,i)=>(
        <View key={i} style={s.odd}><Text style={[s.oddM,{color:o.c}]}>{o.m}</Text><Text style={s.oddP}>{o.p}</Text></View>
      ))}
    </View>
  </View></SafeAreaView>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg}, inner:{flex:1,padding:20,alignItems:'center'},
  topRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',marginBottom:4},
  stk:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:colors.bgCard,borderRadius:radius.full,paddingHorizontal:14,paddingVertical:8,borderWidth:1,borderColor:colors.border},
  stkT:{fontSize:16,fontWeight:'800',color:colors.goldLight},
  title:{fontSize:22,fontWeight:'800',color:colors.text,letterSpacing:-0.5},
  sub:{fontSize:14,color:colors.textDim,marginBottom:32},
  ww:{width:200,height:200,borderRadius:100,backgroundColor:colors.tealGlowStrong,justifyContent:'center',alignItems:'center',marginBottom:32},
  wwInner:{width:180,height:180,borderRadius:90,backgroundColor:colors.bgCard,borderWidth:2,borderColor:colors.tealLight,justifyContent:'center',alignItems:'center'},
  res:{backgroundColor:colors.bgCard,borderRadius:24,padding:28,alignItems:'center',width:'100%',borderWidth:1,borderColor:colors.tealLight,marginBottom:24},
  resLabel:{fontSize:12,fontWeight:'700',color:colors.textMuted,letterSpacing:3,marginBottom:4},
  resMult:{fontSize:52,fontWeight:'900'},
  resAt:{fontSize:13,color:colors.textDim,marginTop:4},
  resStore:{fontSize:20,fontWeight:'700',color:colors.text,marginTop:4},
  resTag:{backgroundColor:colors.tealGlow,borderRadius:radius.full,paddingHorizontal:20,paddingVertical:8,marginTop:16},
  resTagT:{fontSize:13,color:colors.tealLight,fontWeight:'600'},
  resUsed:{fontSize:14,color:colors.tealLight,marginTop:12,fontWeight:'500'},
  spinBtn:{backgroundColor:colors.teal,borderRadius:20,paddingHorizontal:56,paddingVertical:22,marginBottom:32,shadowColor:colors.teal,shadowOffset:{width:0,height:8},shadowOpacity:0.4,shadowRadius:16},
  spinT:{fontSize:20,fontWeight:'800',color:'#fff',letterSpacing:2},
  odds:{flexDirection:'row',gap:10,width:'100%'},
  odd:{backgroundColor:colors.bgCard,borderRadius:14,padding:14,alignItems:'center',flex:1,borderWidth:1,borderColor:colors.border},
  oddM:{fontSize:18,fontWeight:'800'},
  oddP:{fontSize:10,color:colors.textMuted,marginTop:4,fontWeight:'600'},
});
