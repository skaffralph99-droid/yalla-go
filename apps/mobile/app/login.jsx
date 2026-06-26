import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, SafeAreaView, Dimensions } from 'react-native';
import { useAuth } from '../src/lib/auth';
import { supabase } from '../src/lib/supabase';
import { colors } from '../src/lib/theme';
const {width} = Dimensions.get('window');
export default function LoginScreen() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('+961');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, verifyOtp, refreshProfile } = useAuth();
  const handleSendOtp = async () => { if (phone.length<8) return Alert.alert('Error','Enter a valid phone'); setLoading(true); const{error}=await signInWithPhone(phone); setLoading(false); if(error) return Alert.alert('Error',error.message); setStep('otp'); };
  const handleVerifyOtp = async () => { if(otp.length<6) return Alert.alert('Error','Enter 6-digit code'); setLoading(true); const{error}=await verifyOtp(phone,otp,''); setLoading(false); if(error) return Alert.alert('Error',error.message); setStep('name'); };
  const handleComplete = async () => { if(name.trim().length<2) return Alert.alert('Error','Enter your name'); setLoading(true); const{data:{user}}=await supabase.auth.getUser(); if(user){await supabase.from('profiles').update({full_name:name.trim()}).eq('id',user.id);await refreshProfile();} setLoading(false); };
  return (
    <SafeAreaView style={s.c}>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={s.inner}>
        <View style={s.logoWrap}>
          <View style={s.logoBg}><Text style={s.logoIcon}>🎯</Text></View>
          <Text style={s.brand}>YALLA GO</Text>
          <Text style={s.slogan}>Spin · Visit · Win</Text>
        </View>
        <View style={s.card}>
          {step==='phone'&&<><Text style={s.stepTitle}>Welcome to Yalla Go</Text><Text style={s.stepSub}>Enter your phone to get started</Text>
            <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={colors.textMuted} autoFocus/>
            <TouchableOpacity style={[s.btn,loading&&s.off]} onPress={handleSendOtp} disabled={loading}><Text style={s.btnT}>{loading?'Sending...':'Continue'}</Text></TouchableOpacity></>}
          {step==='otp'&&<><Text style={s.stepTitle}>Verify Your Number</Text><Text style={s.stepSub}>Code sent to {phone}</Text>
            <TextInput style={[s.input,s.otpInput]} value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholderTextColor={colors.textMuted} autoFocus/>
            <TouchableOpacity style={[s.btn,(otp.length<6||loading)&&s.off]} onPress={handleVerifyOtp} disabled={otp.length<6||loading}><Text style={s.btnT}>{loading?'Verifying...':'Verify'}</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{setStep('phone');setOtp('');}}><Text style={s.link}>Change number</Text></TouchableOpacity></>}
          {step==='name'&&<><Text style={s.stepTitle}>Almost There!</Text><Text style={s.stepSub}>What should we call you?</Text>
            <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.textMuted} autoCapitalize="words" autoFocus/>
            <TouchableOpacity style={[s.btn,(name.trim().length<2||loading)&&s.off]} onPress={handleComplete} disabled={name.trim().length<2||loading}><Text style={s.btnT}>{loading?'Setting up...':'Start Earning 🎯'}</Text></TouchableOpacity></>}
        </View>
        <View style={s.dots}>
          <View style={[s.dot,step==='phone'&&s.dotOn]}/><View style={[s.dot,step==='otp'&&s.dotOn]}/><View style={[s.dot,step==='name'&&s.dotOn]}/>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  inner:{flex:1,justifyContent:'center',alignItems:'center',padding:24},
  logoWrap:{alignItems:'center',marginBottom:40},
  logoBg:{width:88,height:88,borderRadius:28,backgroundColor:colors.tealGlowStrong,justifyContent:'center',alignItems:'center',marginBottom:16,borderWidth:1,borderColor:'rgba(45,212,191,0.3)'},
  logoIcon:{fontSize:44},
  brand:{fontSize:28,fontWeight:'800',color:colors.text,letterSpacing:6},
  slogan:{fontSize:13,color:colors.tealLight,marginTop:6,letterSpacing:2,textTransform:'uppercase'},
  card:{width:'100%',maxWidth:360,backgroundColor:colors.bgCard,borderRadius:24,padding:28,borderWidth:1,borderColor:colors.border},
  stepTitle:{fontSize:22,fontWeight:'700',color:colors.text,textAlign:'center',marginBottom:4},
  stepSub:{fontSize:14,color:colors.textDim,textAlign:'center',marginBottom:24},
  input:{backgroundColor:colors.bgElevated,borderWidth:1.5,borderColor:colors.borderLight,borderRadius:14,padding:16,fontSize:18,color:colors.text,textAlign:'center'},
  otpInput:{letterSpacing:14,fontSize:28,fontWeight:'600'},
  btn:{backgroundColor:colors.teal,borderRadius:14,padding:17,alignItems:'center',marginTop:16},
  off:{opacity:0.4},
  btnT:{color:'#fff',fontSize:16,fontWeight:'700',letterSpacing:0.5},
  link:{color:colors.tealLight,textAlign:'center',fontSize:14,marginTop:16},
  dots:{flexDirection:'row',gap:8,marginTop:32},
  dot:{width:8,height:8,borderRadius:4,backgroundColor:colors.bgElevated},
  dotOn:{backgroundColor:colors.tealLight,width:24},
});
