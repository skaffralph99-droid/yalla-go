import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/lib/auth';
import { colors, spacing, radius, categoryIcons, categoryLabels } from '../../src/lib/theme';
export default function HomeScreen() {
  const [stores, setStores] = useState([]); const [search, setSearch] = useState(''); const [cat, setCat] = useState('all'); const [refreshing, setRefreshing] = useState(false);
  const { profile } = useAuth(); const router = useRouter();
  const load = async () => { const {data} = await supabase.from('stores').select('*').eq('is_active',true).order('is_featured',{ascending:false}); setStores(data||[]); };
  useEffect(()=>{load();},[]);
  const onRefresh = useCallback(async()=>{setRefreshing(true);await load();setRefreshing(false);},[]);
  const filtered = stores.filter(s=>{const ms=!search||s.name.toLowerCase().includes(search.toLowerCase());const mc=cat==='all'||s.category===cat;return ms&&mc;});
  const cats = ['all',...new Set(stores.map(s=>s.category))];
  return (<SafeAreaView style={st.c}>
    <View style={st.hd}><View><Text style={st.hi}>Ahla {profile?.full_name?.split(' ')[0]} 👋</Text><Text style={st.tag}>Spin. Visit. Win.</Text></View><Text style={{fontSize:36}}>🎯</Text></View>
    <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.teal}/>}>
      <View style={{paddingHorizontal:24,marginBottom:16}}><TextInput style={st.search} placeholder="Search stores..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch}/></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft:24,marginBottom:24}}>{cats.map(c=>(<TouchableOpacity key={c} style={[st.chip,cat===c&&st.chipOn]} onPress={()=>setCat(c)}><Text style={{fontSize:16}}>{c==='all'?'🏪':categoryIcons[c]}</Text><Text style={[st.chipL,cat===c&&st.chipLOn]}>{c==='all'?'All':categoryLabels[c]||c}</Text></TouchableOpacity>))}</ScrollView>
      <View style={st.grid}>{filtered.map(store=>(<TouchableOpacity key={store.id} style={st.card} onPress={()=>router.push('/store/'+store.id)}><Text style={{fontSize:32,marginBottom:8}}>{categoryIcons[store.category]||'🏪'}</Text><Text style={st.cardName} numberOfLines={1}>{store.name}</Text><Text style={st.cardAr} numberOfLines={1}>{store.name_ar}</Text><View style={st.cardFt}><Text style={st.cardPts}>+{store.points_per_visit} pts</Text></View></TouchableOpacity>))}</View>
      <View style={{height:30}}/>
    </ScrollView>
  </SafeAreaView>);
}
const st = StyleSheet.create({ c:{flex:1,backgroundColor:colors.bg}, hd:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:24,paddingBottom:16}, hi:{fontSize:22,fontWeight:'700',color:colors.text}, tag:{fontSize:13,color:colors.textDim,marginTop:2}, search:{backgroundColor:colors.bgCard,borderRadius:14,borderWidth:1,borderColor:colors.border,padding:14,fontSize:15,color:colors.text}, chip:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:colors.bgCard,borderRadius:999,paddingHorizontal:14,paddingVertical:8,marginRight:8,borderWidth:1,borderColor:colors.border}, chipOn:{borderColor:colors.teal,backgroundColor:colors.tealGlow}, chipL:{fontSize:13,color:colors.textDim,fontWeight:'500'}, chipLOn:{color:colors.tealLight}, grid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,gap:10}, card:{width:'47%',backgroundColor:colors.bgCard,borderRadius:14,padding:16,borderWidth:1,borderColor:colors.border}, cardName:{fontSize:15,fontWeight:'600',color:colors.text}, cardAr:{fontSize:12,color:colors.textDim,marginTop:2}, cardFt:{marginTop:10,paddingTop:8,borderTopWidth:1,borderTopColor:colors.border}, cardPts:{fontSize:12,fontWeight:'600',color:colors.tealLight} });
