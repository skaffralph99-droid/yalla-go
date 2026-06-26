import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../../src/lib/theme';
function TI({icon,label,focused}){return(<View style={s.i}><Text style={[s.ic,focused&&s.icOn]}>{icon}</Text><Text style={[s.lb,focused&&s.lbOn]}>{label}</Text></View>);}
export default function TabsLayout(){return(<Tabs screenOptions={{headerShown:false,tabBarStyle:s.bar,tabBarShowLabel:false}}>
  <Tabs.Screen name="index" options={{tabBarIcon:({focused})=><TI icon="🏠" label="Home" focused={focused}/>}}/>
  <Tabs.Screen name="spin" options={{tabBarIcon:({focused})=><TI icon="🎰" label="Spin" focused={focused}/>}}/>
  <Tabs.Screen name="qr" options={{tabBarIcon:({focused})=><TI icon="📱" label="My QR" focused={focused}/>}}/>
  <Tabs.Screen name="points" options={{tabBarIcon:({focused})=><TI icon="⭐" label="Points" focused={focused}/>}}/>
  <Tabs.Screen name="profile" options={{tabBarIcon:({focused})=><TI icon="👤" label="Profile" focused={focused}/>}}/>
</Tabs>);}
const s = StyleSheet.create({bar:{backgroundColor:colors.bgCard,borderTopColor:colors.border,borderTopWidth:1,height:80,paddingTop:8},i:{alignItems:'center',gap:2},ic:{fontSize:22},icOn:{fontSize:24},lb:{fontSize:10,color:colors.textMuted,fontWeight:'500'},lbOn:{color:colors.tealLight,fontWeight:'600'}});
