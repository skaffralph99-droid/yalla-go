import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useAuth } from '../../src/lib/auth';
import { colors, radius } from '../../src/lib/theme';
export default function QRScreen() {
  const { user, profile } = useAuth();
  const code = user?.id || '';
  const chunks = [code.slice(0,4),code.slice(4,8),code.slice(8,12),code.slice(12,16)].filter(Boolean);
  return (<SafeAreaView style={s.c}><View style={s.inner}>
    <Text style={s.title}>Your Member Pass</Text>
    <Text style={s.sub}>Show this to the cashier when you visit</Text>
    <View style={s.card}>
      <View style={s.cardTop}><Text style={s.cardTopT}>🎯 YALLA GO</Text><Text style={s.cardTopBadge}>MEMBER</Text></View>
      <View style={s.codeArea}>
        <Text style={s.codeLabel}>YOUR UNIQUE CODE</Text>
        <View style={s.codeChunks}>{chunks.map((ch,i)=>(<View key={i} style={s.chunk}><Text style={s.chunkT}>{ch.toUpperCase()}</Text></View>))}</View>
        <Text style={s.codeFull} selectable>{code}</Text>
      </View>
      <View style={s.userRow}>
        <View style={s.userAvatar}><Text style={s.userAvatarT}>{(profile?.full_name||'U')[0].toUpperCase()}</Text></View>
        <View><Text style={s.userName}>{profile?.full_name||'User'}</Text><Text style={s.userPhone}>{profile?.phone||''}</Text></View>
      </View>
    </View>
    <View style={s.tip}>
      <Text style={{fontSize:20}}>💡</Text>
      <Text style={s.tipT}>Show this code every time you visit a partner store. You earn points automatically!</Text>
    </View>
  </View></SafeAreaView>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  inner:{flex:1,padding:20,alignItems:'center',justifyContent:'center'},
  title:{fontSize:24,fontWeight:'900',color:colors.text},
  sub:{fontSize:14,color:colors.textDim,marginTop:6,marginBottom:28,textAlign:'center'},
  card:{backgroundColor:'#fff',borderRadius:28,overflow:'hidden',width:'100%',shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.1,shadowRadius:16,elevation:6,marginBottom:24},
  cardTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:colors.primary,paddingHorizontal:20,paddingVertical:14},
  cardTopT:{fontSize:15,fontWeight:'900',color:'#fff',letterSpacing:2},
  cardTopBadge:{fontSize:11,fontWeight:'700',color:colors.primary,backgroundColor:'#fff',borderRadius:8,paddingHorizontal:10,paddingVertical:4},
  codeArea:{padding:28,alignItems:'center'},
  codeLabel:{fontSize:10,fontWeight:'700',color:colors.textMuted,letterSpacing:3,marginBottom:16},
  codeChunks:{flexDirection:'row',gap:8},
  chunk:{backgroundColor:colors.bgSoft,borderRadius:12,paddingHorizontal:14,paddingVertical:12,borderWidth:1.5,borderColor:colors.border},
  chunkT:{fontSize:22,fontWeight:'900',color:colors.text,letterSpacing:2,fontFamily:Platform.OS==='ios'?'Menlo':'monospace'},
  codeFull:{fontSize:8,color:colors.textMuted,marginTop:14,fontFamily:Platform.OS==='ios'?'Menlo':'monospace'},
  userRow:{flexDirection:'row',alignItems:'center',padding:20,gap:14,borderTopWidth:1,borderTopColor:colors.borderLight},
  userAvatar:{width:48,height:48,borderRadius:24,backgroundColor:colors.accent,justifyContent:'center',alignItems:'center'},
  userAvatarT:{fontSize:20,fontWeight:'800',color:'#fff'},
  userName:{fontSize:17,fontWeight:'700',color:colors.text},
  userPhone:{fontSize:13,color:colors.textDim,marginTop:2},
  tip:{flexDirection:'row',gap:12,backgroundColor:colors.primaryGlow,borderRadius:18,padding:18,borderWidth:1,borderColor:'rgba(16,185,129,0.2)'},
  tipT:{flex:1,fontSize:13,color:colors.primaryDark,lineHeight:20,fontWeight:'500'},
});
