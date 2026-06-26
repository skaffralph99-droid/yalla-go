import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../../src/lib/auth';
import { colors, radius } from '../../src/lib/theme';
export default function QRScreen() {
  const { user, profile } = useAuth();
  const code = user?.id || '';
  const shortCode = code.slice(0,4)+' '+code.slice(4,8);
  return (<SafeAreaView style={s.c}><View style={s.inner}>
    <Text style={s.title}>Your Pass</Text>
    <Text style={s.sub}>Show this code to earn points</Text>
    <View style={s.card}>
      <View style={s.topStrip}><Text style={s.topStripT}>YALLA GO MEMBER</Text></View>
      <View style={s.codeBox}>
        <Text style={s.codeLabel}>SCAN CODE</Text>
        <Text style={s.codeMain}>{shortCode.toUpperCase()}</Text>
        <View style={s.codeLine}/>
        <Text style={s.codeFull} selectable>{code}</Text>
      </View>
      <View style={s.userInfo}>
        <View style={s.avatar}><Text style={s.avatarT}>{(profile?.full_name||'U')[0].toUpperCase()}</Text></View>
        <View>
          <Text style={s.userName}>{profile?.full_name||'User'}</Text>
          <Text style={s.userPhone}>{profile?.phone||''}</Text>
        </View>
      </View>
    </View>
    <View style={s.tip}>
      <Text style={{fontSize:18}}>💡</Text>
      <Text style={s.tipT}>The cashier enters your code to give you points. One scan per store per day.</Text>
    </View>
  </View></SafeAreaView>);
}
const s = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  inner:{flex:1,padding:20,alignItems:'center',justifyContent:'center'},
  title:{fontSize:24,fontWeight:'800',color:colors.text,letterSpacing:-0.5},
  sub:{fontSize:14,color:colors.textDim,marginTop:4,marginBottom:28},
  card:{backgroundColor:colors.bgCard,borderRadius:24,overflow:'hidden',width:'100%',borderWidth:1,borderColor:colors.border,marginBottom:24},
  topStrip:{backgroundColor:colors.teal,paddingVertical:10,alignItems:'center'},
  topStripT:{fontSize:11,fontWeight:'800',color:'#fff',letterSpacing:4},
  codeBox:{padding:32,alignItems:'center',backgroundColor:'#FFFFFF'},
  codeLabel:{fontSize:11,fontWeight:'700',color:'#9CA3AF',letterSpacing:3,marginBottom:12},
  codeMain:{fontSize:36,fontWeight:'900',color:'#0F172A',letterSpacing:8},
  codeLine:{width:60,height:2,backgroundColor:'#E5E7EB',marginVertical:14,borderRadius:1},
  codeFull:{fontSize:9,color:'#9CA3AF',fontFamily:Platform?.OS==='ios'?'Menlo':'monospace'},
  userInfo:{flexDirection:'row',alignItems:'center',padding:20,gap:14,borderTopWidth:1,borderTopColor:colors.border},
  avatar:{width:44,height:44,borderRadius:22,backgroundColor:colors.teal,justifyContent:'center',alignItems:'center'},
  avatarT:{fontSize:18,fontWeight:'700',color:'#fff'},
  userName:{fontSize:16,fontWeight:'700',color:colors.text},
  userPhone:{fontSize:13,color:colors.textDim,marginTop:2},
  tip:{flexDirection:'row',gap:10,backgroundColor:colors.tealGlow,borderRadius:16,padding:16,borderWidth:1,borderColor:'rgba(45,212,191,0.2)'},
  tipT:{flex:1,fontSize:13,color:colors.tealLight,lineHeight:20},
});
