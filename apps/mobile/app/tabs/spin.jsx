import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius } from '../../src/lib/theme';
export default function SpinScreen() {
  const [result, setResult] = useState(null); const [already, setAlready] = useState(false); const [today, setToday] = useState(null); const [spinning, setSpinning] = useState(false); const [streak, setStreak] = useState(0);
  const rot = useRef(new Animated.Value(0)).current; const sc = useRef(new Animated.Value(1)).current;
  const { user, profile, refreshProfile } = useAuth();
  useEffect(()=>{const d=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Beirut'});supabase.from('daily_spins').select('*,stores(name,name_ar)').eq('user_id',user.id).eq('spin_date',d).single().then(({data})=>{if(data){setAlready(true);setToday(data);}});setStreak(profile?.streak_count||0);},[]);
  const handleSpin = async()=>{setSpinning(true);Animated.sequence([Animated.timing(rot,{toValue:5,duration:2000,useNativeDriver:true}),Animated.spring(sc,{toValue:1.15,useNativeDriver:true}),Animated.spring(sc,{toValue:1,useNativeDriver:true})]).start();const{data,error}=await supabase.rpc('do_daily_spin',{p_user_id:user.id});setTimeout(()=>{setSpinning(false);if(error||!data?.success){Alert.alert('Error',data?.error||error?.message||'Failed');return;}setResult(data);setAlready(true);setStreak(data.streak_count);refreshProfile();},2200);};
  const rotation=rot.interpolate({inputRange:[0,5],outputRange:['0deg','1800deg']});
  const mc=(m)=>m===10?'#EF4444':m===5?colors.gold:m===3?colors.tealLight:colors.textDim;
  return(<SafeAreaView style={s.c}><View style={s.inner}>
    <View style={s.stk}><Text style={{fontSize:18}}>🔥</Text><Text style={s.stkT}>{streak} day streak</Text></View>
    <Text style={s.title}>Daily Spin</Text><Text style={s.sub}>{already?'Come back tomorrow!':'Tap to spin for a boost!'}</Text>
    <View style={s.ww}><Animated.View style={{transform:[{rotate:rotation},{scale:sc}]}}><Text style={{fontSize:72}}>🎰</Text></Animated.View></View>
    {result?(<View style={s.res}><Text style={[s.resMult,{color:mc(result.multiplier)}]}>{result.multiplier}x BOOST</Text><Text style={s.resStore}>{result.store_name}</Text></View>)
    :already&&today?(<View style={s.res}><Text style={[s.resMult,{color:mc(today.multiplier)}]}>{today.multiplier}x BOOST</Text><Text style={s.resStore}>{today.stores?.name}</Text></View>)
    :(<TouchableOpacity style={[s.spinBtn,spinning&&{opacity:0.5}]} onPress={handleSpin} disabled={spinning||already}><Text style={s.spinT}>{spinning?'Spinning...':'🎯 SPIN!'}</Text></TouchableOpacity>)}
    <View style={s.odds}><View style={s.odd}><Text style={s.oddM}>2x</Text><Text style={s.oddP}>60%</Text></View><View style={s.odd}><Text style={[s.oddM,{color:colors.tealLight}]}>3x</Text><Text style={s.oddP}>25%</Text></View><View style={s.odd}><Text style={[s.oddM,{color:colors.gold}]}>5x</Text><Text style={s.oddP}>10%</Text></View><View style={s.odd}><Text style={[s.oddM,{color:'#EF4444'}]}>10x</Text><Text style={s.oddP}>5%</Text></View></View>
  </View></SafeAreaView>);
}
const s = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bg}, inner:{flex:1,padding:24,alignItems:'center'}, stk:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:colors.bgCard,borderRadius:999,paddingHorizontal:16,paddingVertical:8,marginBottom:24,borderWidth:1,borderColor:colors.border}, stkT:{fontSize:14,fontWeight:'600',color:colors.text}, title:{fontSize:28,fontWeight:'700',color:colors.text}, sub:{fontSize:14,color:colors.textDim,marginTop:4,marginBottom:32}, ww:{width:180,height:180,borderRadius:90,backgroundColor:colors.bgCard,borderWidth:3,borderColor:colors.teal,justifyContent:'center',alignItems:'center',marginBottom:32}, res:{backgroundColor:colors.bgCard,borderRadius:20,padding:24,alignItems:'center',width:'100%',borderWidth:1,borderColor:colors.teal,marginBottom:24}, resMult:{fontSize:36,fontWeight:'800'}, resStore:{fontSize:18,fontWeight:'600',color:colors.text,marginTop:8}, spinBtn:{backgroundColor:colors.teal,borderRadius:20,paddingHorizontal:48,paddingVertical:20,marginBottom:32}, spinT:{fontSize:22,fontWeight:'700',color:'#fff'}, odds:{flexDirection:'row',gap:16,width:'100%'}, odd:{backgroundColor:colors.bgCard,borderRadius:8,padding:16,alignItems:'center',flex:1,borderWidth:1,borderColor:colors.border}, oddM:{fontSize:18,fontWeight:'700',color:colors.textDim}, oddP:{fontSize:11,color:colors.textMuted,marginTop:4} });
