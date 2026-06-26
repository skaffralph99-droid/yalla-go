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
  const firstName = profile?.full_name?.split(' ')[0] || '';
  return (<SafeAreaView style={st.c}>
    <View style={st.hd}>
      <View><Text style={st.hi}>Hey {firstName} 👋</Text><Text style={st.tag}>Where are you heading today?</Text></View>
      <View style={st.logoPill}><Text style={{fontSize:20}}>🎯</Text></View>
    </View>
    <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tealLight}/>}>
      <View style={{paddingHorizontal:20,marginBottom:16}}>
        <View style={st.searchWrap}><Text style={st.searchIcon}>🔍</Text><TextInput style={st.search} placeholder="Search stores..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch}/></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft:20,marginBottom:20}}>{cats.map(c=>(<TouchableOpacity key={c} style={[st.chip,cat===c&&st.chipOn]} onPress={()=>setCat(c)}>
        <Text style={{fontSize:14}}>{c==='all'?'🏪':categoryIcons[c]}</Text>
        <Text style={[st.chipL,cat===c&&st.chipLOn]}>{c==='all'?'All':categoryLabels[c]||c}</Text>
      </TouchableOpacity>))}</ScrollView>
      <View style={st.grid}>{filtered.map(store=>(<TouchableOpacity key={store.id} style={st.card} onPress={()=>router.push('/store/'+store.id)} activeOpacity={0.7}>
        <View style={st.cardIcon}><Text style={{fontSize:28}}>{categoryIcons[store.category]||'🏪'}</Text></View>
        <Text style={st.cardName} numberOfLines={1}>{store.name}</Text>
        <Text style={st.cardAr} numberOfLines={1}>{store.name_ar}</Text>
        <View style={st.cardBottom}>
          <View style={st.ptsBadge}><Text style={st.ptsText}>+{store.points_per_visit}</Text></View>
          <Text style={st.cardRw}>{store.reward_visits_required} for reward</Text>
        </View>
      </TouchableOpacity>))}</View>
      <View style={{height:30}}/>
    </ScrollView>
  </SafeAreaView>);
}
const st = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  hd:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:8,paddingBottom:16},
  hi:{fontSize:24,fontWeight:'800',color:colors.text,letterSpacing:-0.5},
  tag:{fontSize:13,color:colors.textDim,marginTop:4},
  logoPill:{width:44,height:44,borderRadius:14,backgroundColor:colors.tealGlow,borderWidth:1,borderColor:'rgba(45,212,191,0.2)',justifyContent:'center',alignItems:'center'},
  searchWrap:{flexDirection:'row',alignItems:'center',backgroundColor:colors.bgCard,borderRadius:16,borderWidth:1,borderColor:colors.border,paddingHorizontal:16},
  searchIcon:{fontSize:16,marginRight:10},
  search:{flex:1,paddingVertical:14,fontSize:15,color:colors.text},
  chip:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:colors.bgCard,borderRadius:radius.full,paddingHorizontal:16,paddingVertical:10,marginRight:8,borderWidth:1,borderColor:colors.border},
  chipOn:{borderColor:colors.tealLight,backgroundColor:colors.tealGlow},
  chipL:{fontSize:13,color:colors.textMuted,fontWeight:'600'},
  chipLOn:{color:colors.tealLight},
  grid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:16,gap:12},
  card:{width:'47%',backgroundColor:colors.bgCard,borderRadius:20,padding:16,borderWidth:1,borderColor:colors.border},
  cardIcon:{width:52,height:52,borderRadius:16,backgroundColor:colors.bgElevated,justifyContent:'center',alignItems:'center',marginBottom:12},
  cardName:{fontSize:15,fontWeight:'700',color:colors.text},
  cardAr:{fontSize:12,color:colors.textDim,marginTop:2},
  cardBottom:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:14,paddingTop:12,borderTopWidth:1,borderTopColor:colors.border},
  ptsBadge:{backgroundColor:colors.tealGlow,borderRadius:8,paddingHorizontal:10,paddingVertical:4},
  ptsText:{fontSize:13,fontWeight:'700',color:colors.tealLight},
  cardRw:{fontSize:10,color:colors.textMuted},
});
