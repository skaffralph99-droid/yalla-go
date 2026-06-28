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
      <View><Text style={st.hi}>Hey {firstName}! 👋</Text><Text style={st.tag}>Earn points at your favorite spots</Text></View>
      <View style={st.avatar}><Text style={st.avatarT}>{firstName[0]||'?'}</Text></View>
    </View>
    <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary}/>}>
      <View style={st.banner}>
        <View style={st.bannerLeft}><Text style={st.bannerEmoji}>🎰</Text><View><Text style={st.bannerTitle}>Daily Spin Ready!</Text><Text style={st.bannerSub}>Win up to 10x boost today</Text></View></View>
        <TouchableOpacity style={st.bannerBtn} onPress={()=>router.push('/tabs/spin')}><Text style={st.bannerBtnT}>Spin →</Text></TouchableOpacity>
      </View>
      <View style={{paddingHorizontal:20,marginBottom:14}}>
        <View style={st.searchWrap}><Text style={{fontSize:16}}>🔍</Text><TextInput style={st.search} placeholder="Search stores..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch}/></View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft:20,marginBottom:18}}>{cats.map(c=>(<TouchableOpacity key={c} style={[st.chip,cat===c&&st.chipOn]} onPress={()=>setCat(c)}>
        <Text style={{fontSize:16}}>{c==='all'?'✨':categoryIcons[c]}</Text>
        <Text style={[st.chipL,cat===c&&st.chipLOn]}>{c==='all'?'All':categoryLabels[c]||c}</Text>
      </TouchableOpacity>))}</ScrollView>
      <View style={st.grid}>{filtered.map(store=>(<TouchableOpacity key={store.id} style={st.card} onPress={()=>router.push('/store/'+store.id)} activeOpacity={0.7}>
        <View style={st.cardIconWrap}><Text style={{fontSize:30}}>{categoryIcons[store.category]||'🏪'}</Text></View>
        <Text style={st.cardName} numberOfLines={1}>{store.name}</Text>
        <Text style={st.cardAr} numberOfLines={1}>{store.name_ar}</Text>
        <View style={st.cardBottom}>
          <View style={st.ptsBadge}><Text style={st.ptsText}>+{store.points_per_visit} pts</Text></View>
        </View>
      </TouchableOpacity>))}</View>
      <View style={{height:30}}/>
    </ScrollView>
  </SafeAreaView>);
}
const st = StyleSheet.create({
  c:{flex:1,backgroundColor:colors.bg},
  hd:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:20,paddingTop:10,paddingBottom:16},
  hi:{fontSize:26,fontWeight:'900',color:colors.text},
  tag:{fontSize:13,color:colors.textDim,marginTop:4},
  avatar:{width:46,height:46,borderRadius:23,backgroundColor:colors.primary,justifyContent:'center',alignItems:'center'},
  avatarT:{fontSize:20,fontWeight:'800',color:'#fff'},
  banner:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:colors.accent,borderRadius:20,marginHorizontal:20,marginBottom:18,padding:18},
  bannerLeft:{flexDirection:'row',alignItems:'center',gap:12,flex:1},
  bannerEmoji:{fontSize:32},
  bannerTitle:{fontSize:16,fontWeight:'800',color:'#fff'},
  bannerSub:{fontSize:12,color:'rgba(255,255,255,0.8)',marginTop:2},
  bannerBtn:{backgroundColor:'rgba(255,255,255,0.25)',borderRadius:12,paddingHorizontal:16,paddingVertical:10},
  bannerBtnT:{color:'#fff',fontWeight:'700',fontSize:14},
  searchWrap:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:16,paddingHorizontal:16,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.05,shadowRadius:8,elevation:2},
  search:{flex:1,paddingVertical:14,fontSize:15,color:colors.text,marginLeft:10},
  chip:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'#fff',borderRadius:radius.full,paddingHorizontal:16,paddingVertical:10,marginRight:8,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.04,shadowRadius:4,elevation:1},
  chipOn:{backgroundColor:colors.primaryLight,borderWidth:1.5,borderColor:colors.primary},
  chipL:{fontSize:13,color:colors.textDim,fontWeight:'600'},
  chipLOn:{color:colors.primaryDark,fontWeight:'700'},
  grid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:16,gap:12},
  card:{width:'47%',backgroundColor:'#fff',borderRadius:20,padding:16,shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.06,shadowRadius:10,elevation:3},
  cardIconWrap:{width:56,height:56,borderRadius:18,backgroundColor:colors.bgSoft,justifyContent:'center',alignItems:'center',marginBottom:12},
  cardName:{fontSize:15,fontWeight:'700',color:colors.text},
  cardAr:{fontSize:12,color:colors.textDim,marginTop:2},
  cardBottom:{marginTop:14,paddingTop:12,borderTopWidth:1,borderTopColor:colors.borderLight},
  ptsBadge:{backgroundColor:colors.primaryGlow,borderRadius:10,paddingHorizontal:12,paddingVertical:5,alignSelf:'flex-start'},
  ptsText:{fontSize:13,fontWeight:'800',color:colors.primary},
});
