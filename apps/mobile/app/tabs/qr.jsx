import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius } from '../../src/lib/theme';
export default function QRScreen() {
  const { user, profile } = useAuth();
  return (<SafeAreaView style={s.c}><View style={s.inner}>
    <Text style={s.title}>My QR Code</Text><Text style={s.sub}>Show this to the cashier to earn points</Text>
    <View style={s.card}><View style={s.qr}><Text style={s.qrLabel}>YOUR CODE</Text><Text style={s.qrId}>{user?.id?.slice(0,8)}</Text><Text style={s.qrFull} selectable>{user?.id}</Text></View><Text style={s.name}>{profile?.full_name||'User'}</Text><Text style={s.phone}>{profile?.phone||''}</Text></View>
    <View style={s.info}><Text style={{fontSize:20}}>💡</Text><Text style={s.infoT}>The cashier scans your QR code and you earn points automatically. One scan per store per day.</Text></View>
  </View></SafeAreaView>);
}
const s = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bg}, inner:{flex:1,padding:24,alignItems:'center',justifyContent:'center'}, title:{fontSize:24,fontWeight:'700',color:colors.text}, sub:{fontSize:14,color:colors.textDim,marginTop:4,marginBottom:32}, card:{backgroundColor:colors.bgCard,borderRadius:20,padding:32,alignItems:'center',borderWidth:1,borderColor:colors.border,width:'100%',marginBottom:24}, qr:{backgroundColor:'#FFFFFF',borderRadius:14,padding:24,marginBottom:24,alignItems:'center',width:'100%'}, qrLabel:{fontSize:12,fontWeight:'600',color:'#64748B',marginBottom:8}, qrId:{fontSize:32,fontWeight:'800',color:'#0F172A',letterSpacing:4}, qrFull:{fontSize:10,color:'#94A3B8',marginTop:8,textAlign:'center'}, name:{fontSize:20,fontWeight:'700',color:colors.text}, phone:{fontSize:14,color:colors.textDim,marginTop:4}, info:{flexDirection:'row',gap:8,backgroundColor:colors.tealGlow,borderRadius:14,padding:16,borderWidth:1,borderColor:colors.teal}, infoT:{flex:1,fontSize:13,color:colors.tealLight,lineHeight:18} });
