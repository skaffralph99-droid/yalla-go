import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/lib/auth';
import { colors, spacing, radius, categoryIcons } from '../src/lib/theme';
export default function PickFavoritesScreen() {
  const [stores, setStores] = useState([]); const [selected, setSelected] = useState([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const { user } = useAuth(); const router = useRouter();
  useEffect(() => { supabase.from('stores').select('id,name,name_ar,category').eq('is_active',true).order('name').then(({data})=>{setStores(data||[]);setLoading(false);}); }, []);
  const toggle = (id) => { if (selected.includes(id)) setSelected(selected.filter(s=>s!==id)); else if (selected.length<5) setSelected([...selected,id]); else Alert.alert('Maximum 5','Deselect one first'); };
  const handleSave = async () => { if (selected.length<3) return Alert.alert('Pick at least 3'); setSaving(true); await supabase.from('user_favorites').insert(selected.map(sid=>({user_id:user.id,store_id:sid}))); setSaving(false); router.replace('/tabs'); };
  if (loading) return <View style={[s.c,{justifyContent:'center',alignItems:'center'}]}><ActivityIndicator size="large" color={colors.teal}/></View>;
  return (<SafeAreaView style={s.c}>
    <View style={s.hd}><Text style={s.t}>Pick Your Favorites</Text><Text style={s.sub}>Choose 3-5 stores for your daily spin 🎰</Text><View style={s.pill}><Text style={s.pillT}>{selected.length}/5 selected</Text></View></View>
    <FlatList data={stores} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:24,paddingBottom:100}} renderItem={({item})=>{const on=selected.includes(item.id);return(
      <TouchableOpacity style={[s.card,on&&s.cardOn]} onPress={()=>toggle(item.id)}><Text style={{fontSize:28,marginRight:16}}>{categoryIcons[item.category]||'🏪'}</Text><View style={{flex:1}}><Text style={s.name}>{item.name}</Text><Text style={s.ar}>{item.name_ar}</Text></View><View style={[s.chk,on&&s.chkOn]}>{on&&<Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>✓</Text>}</View></TouchableOpacity>);}}/>
    <View style={s.ft}><TouchableOpacity style={[s.btn,(selected.length<3||saving)&&{opacity:0.5}]} onPress={handleSave} disabled={selected.length<3||saving}><Text style={s.btnT}>{saving?'Saving...':`Continue with ${selected.length} →`}</Text></TouchableOpacity></View>
  </SafeAreaView>);
}
const s = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bg}, hd:{padding:24,paddingBottom:16}, t:{fontSize:28,fontWeight:'700',color:colors.text}, sub:{fontSize:14,color:colors.textDim,marginTop:4}, pill:{backgroundColor:colors.tealGlow,borderWidth:1,borderColor:colors.teal,borderRadius:999,paddingHorizontal:16,paddingVertical:6,alignSelf:'flex-start',marginTop:16}, pillT:{color:colors.tealLight,fontWeight:'600',fontSize:13}, card:{flexDirection:'row',alignItems:'center',backgroundColor:colors.bgCard,borderRadius:14,padding:16,marginBottom:8,borderWidth:1.5,borderColor:colors.border}, cardOn:{borderColor:colors.teal,backgroundColor:'rgba(13,148,136,0.08)'}, name:{fontSize:16,fontWeight:'600',color:colors.text}, ar:{fontSize:13,color:colors.textDim,marginTop:2}, chk:{width:28,height:28,borderRadius:14,borderWidth:2,borderColor:colors.border,justifyContent:'center',alignItems:'center'}, chkOn:{backgroundColor:colors.teal,borderColor:colors.teal}, ft:{position:'absolute',bottom:0,left:0,right:0,padding:24,paddingBottom:32,backgroundColor:colors.bg,borderTopWidth:1,borderTopColor:colors.border}, btn:{backgroundColor:colors.teal,borderRadius:14,padding:16,alignItems:'center'}, btnT:{color:'#fff',fontSize:16,fontWeight:'600'} });
