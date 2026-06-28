import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../src/lib/auth';
import { supabase } from '../src/lib/supabase';
import { colors } from '../src/lib/theme';
export default function LoginScreen() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('+961');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, verifyOtp, refreshProfile } = useAuth();
  const handleSendOtp = async () => { if (phone.length<8) return Alert.alert('Oops','Enter a valid phone'); setLoading(true); const{error}=await signInWithPhone(phone); setLoading(false); if(error) return Alert.alert('Error',error.message); setStep('otp'); };
  const handleVerifyOtp = async () => { if(otp.length<6) return Alert.alert('Oops','Enter 6-digit code'); setLoading(true); const{error}=await verifyOtp(phone,otp,''); setLoading(false); if(error) return Alert.alert('Error',error.message); setStep('name'); };
  const handleComplete = async () => { if(name.trim().length<2) return Alert.alert('Oops','Enter your name'); setLoading(true); const{data:{user}}=await supabase.auth.getUser(); if(user){await supabase.from('profiles').update({full_name:name.trim()}).eq('id',user.id);await refreshProfile();} setLoading(false); };
  return (
    <View style={s.c}>
      <View style={s.topBg}>
        <Text style={s.topEmoji}>🎯</Text>
        <Text style={s.topBrand}>YALLA GO</Text>
        <Text style={s.topSlogan}>Spin · Visit · Win</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={s.bottom}>
        <View style={s.card}>
          {step==='phone'&&<><Text style={s.h}>Welcome!</Text><Text style={s.p}>Enter your phone to start earning rewards</Text>
            <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={colors.textMuted} autoFocus/>
            <TouchableOpacity style={[s.btn,loading&&{opacity:0.5}]} onPress={handleSendOtp} disabled={loading}><Text style={s.btnT}>{loading?'Sending...':'Get Started →'}</Text></TouchableOpacity></>}
          {step==='otp'&&<><Text style={s.h}>Check your phone 📱</Text><Text style={s.p}>Enter the code we sent to {phone}</Text>
            <TextInput style={[s.input,{letterSpacing:14,fontSize:28,fontWeight:'700'}]} value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholderTextColor={colors.textMuted} autoFocus/>
            <TouchableOpacity style={[s.btn,(otp.length<6||loading)&&{opacity:0.5}]} onPress={handleVerifyOtp} disabled={otp.length<6||loading}><Text style={s.btnT}>{loading?'Checking...':'Verify →'}</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{setStep('phone');setOtp('');}}><Text style={s.link}>Wrong number?</Text></TouchableOpacity></>}
          {step==='name'&&<><Text style={s.h}>Almost there! 🎉</Text><Text style={s.p}>What should we call you?</Text>
            <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.textMuted} autoCapitalize="words" autoFocus/>
            <TouchableOpacity style={[s.btn,(name.trim().length<2||loading)&&{opacity:0.5}]} onPress={handleComplete} disabled={name.trim().length<2||loading}><Text style={s.btnT}>{loading?'Setting up...':'Start Earning! 🎯'}</Text></TouchableOpacity></>}
          <View style={s.dots}><View style={[s.dot,step==='phone'&&s.dotOn]}/><View style={[s.dot,step==='otp'&&s.dotOn]}/><View style={[s.dot,step==='name'&&s.dotOn]}/></View>
        </View>
      </KeyboardAvoidingView>
    </View>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.primary},
  topBg:{alignItems:'center',paddingTop:80,paddingBottom:40},
  topEmoji:{fontSize:56,marginBottom:12},
  topBrand:{fontSize:32,fontWeight:'900',color:'#fff',letterSpacing:6},
  topSlogan:{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:8,letterSpacing:2},
  bottom:{flex:1,justifyContent:'flex-end'},
  card:{backgroundColor:'#fff',borderTopLeftRadius:32,borderTopRightRadius:32,padding:28,paddingTop:36,paddingBottom:40},
  h:{fontSize:24,fontWeight:'800',color:colors.text,marginBottom:4},
  p:{fontSize:14,color:colors.textDim,marginBottom:24,lineHeight:20},
  input:{backgroundColor:colors.bgSoft,borderWidth:2,borderColor:colors.border,borderRadius:16,padding:16,fontSize:18,color:colors.text,textAlign:'center'},
  btn:{backgroundColor:colors.primary,borderRadius:16,padding:18,alignItems:'center',marginTop:16,shadowColor:colors.primary,shadowOffset:{width:0,height:4},shadowOpacity:0.3,shadowRadius:8,elevation:4},
  btnT:{color:'#fff',fontSize:17,fontWeight:'700'},
  link:{color:colors.primary,textAlign:'center',fontSize:14,fontWeight:'600',marginTop:16},
  dots:{flexDirection:'row',gap:8,justifyContent:'center',marginTop:28},
  dot:{width:8,height:8,borderRadius:4,backgroundColor:colors.border},
  dotOn:{backgroundColor:colors.primary,width:28},
});
