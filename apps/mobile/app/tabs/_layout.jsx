import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../../src/lib/theme';
function TI({icon,label,focused}){return(<View style={s.i}><View style={[s.iconWrap,focused&&s.iconWrapOn]}><Text style={s.ic}>{icon}</Text></View><Text style={[s.lb,focused&&s.lbOn]}>{label}</Text></View>);}
export default function TabsLayout(){return(<Tabs screenOptions={{headerShown:false,tabBarStyle:s.bar,tabBarShowLabel:false}}>
  <Tabs.Screen name="index" options={{tabBarIcon:({focused})=><TI icon="🏠" label="Home" focused={focused}/>}}/>
  <Tabs.Screen name="spin" options={{tabBarIcon:({focused})=><TI icon="🎰" label="Spin" focused={focused}/>}}/>
  <Tabs.Screen name="qr" options={{tabBarIcon:({focused})=><TI icon="📱" label="QR" focused={focused}/>}}/>
  <Tabs.Screen name="points" options={{tabBarIcon:({focused})=><TI icon="⭐" label="Points" focused={focused}/>}}/>
  <Tabs.Screen name="profile" options={{tabBarIcon:({focused})=><TI icon="👤" label="Me" focused={focused}/>}}/>
</Tabs>);}
const s = StyleSheet.create({
  bar:{backgroundColor:colors.bgCard,borderTopColor:colors.border,borderTopWidth:1,height:88,paddingTop:6,paddingBottom:8},
  i:{alignItems:'center',gap:4,width:56},
  iconWrap:{width:40,height:32,borderRadius:16,justifyContent:'center',alignItems:'center'},
  iconWrapOn:{backgroundColor:colors.tealGlowStrong},
  ic:{fontSize:20},
  lb:{fontSize:10,color:colors.textMuted,fontWeight:'500'},
  lbOn:{color:colors.tealLight,fontWeight:'700'},
});
