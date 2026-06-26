import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../src/lib/auth';
import { colors, spacing, radius } from '../src/lib/theme';
export default function LoginScreen() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('+961');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, verifyOtp } = useAuth();
  const otpRef = useRef(null);
  const handleSendOtp = async () => { if (phone.length < 8) return Alert.alert('Error','Enter a valid phone number'); setLoading(true); const { error } = await signInWithPhone(phone); setLoading(false); if (error) return Alert.alert('Error', error.message); setStep('otp'); };
  const handleVerifyOtp = () => { if (otp.length < 6) return Alert.alert('Error','Enter the 6-digit code'); setStep('name'); };
  const handleComplete = async () => { if (name.trim().length < 2) return Alert.alert('Error','Enter your name'); setLoading(true); const { error } = await verifyOtp(phone, otp, name.trim()); setLoading(false); if (error) return Alert.alert('Error', error.message); };
  return (
    <SafeAreaView style={s.c}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.inner}>
      <Text style={s.logo}>🎯</Text><Text style={s.title}>Yalla Go</Text><Text style={s.sub}>Spin. Visit. Win.</Text>
      {step === 'phone' && <View style={s.form}><Text style={s.label}>Your phone number</Text><TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholderTextColor={colors.textMuted} autoFocus /><TouchableOpacity style={[s.btn, loading&&s.off]} onPress={handleSendOtp} disabled={loading}><Text style={s.btnT}>{loading?'Sending...':'Send Code'}</Text></TouchableOpacity></View>}
      {step === 'otp' && <View style={s.form}><Text style={s.label}>Enter the 6-digit code</Text><TextInput ref={otpRef} style={[s.input,{letterSpacing:12,fontSize:24}]} value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholderTextColor={colors.textMuted} /><TouchableOpacity style={[s.btn, otp.length<6&&s.off]} onPress={handleVerifyOtp}><Text style={s.btnT}>Verify</Text></TouchableOpacity></View>}
      {step === 'name' && <View style={s.form}><Text style={s.label}>What is your name?</Text><TextInput style={s.input} value={name} onChangeText={setName} placeholder="Your full name" placeholderTextColor={colors.textMuted} autoCapitalize="words" autoFocus /><TouchableOpacity style={[s.btn,(name.trim().length<2||loading)&&s.off]} onPress={handleComplete}><Text style={s.btnT}>{loading?'Setting up...':'Lets Go! 🎯'}</Text></TouchableOpacity></View>}
    </KeyboardAvoidingView></SafeAreaView>);
}
const s = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bg}, inner:{flex:1,justifyContent:'center',alignItems:'center',padding:24}, logo:{fontSize:64,marginBottom:8}, title:{fontSize:36,fontWeight:'700',color:colors.text}, sub:{fontSize:16,color:colors.textDim,marginBottom:48}, form:{width:'100%',maxWidth:340,gap:16}, label:{fontSize:16,fontWeight:'600',color:colors.text,textAlign:'center'}, input:{backgroundColor:colors.bgCard,borderWidth:2,borderColor:colors.border,borderRadius:14,padding:16,fontSize:18,color:colors.text,textAlign:'center'}, btn:{backgroundColor:colors.teal,borderRadius:14,padding:16,alignItems:'center'}, off:{opacity:0.5}, btnT:{color:'#fff',fontSize:16,fontWeight:'600'} });
