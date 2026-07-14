import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, shadow } from '../theme/theme';

const CATEGORIES = [
  'Furnitur', 'Dapur', 'Elektronik', 'Perlengkapan Tidur',
  'Dekorasi', 'Kebersihan', 'Aksesoris', 'Peralatan', 'Alat Tulis', 'Fashion'
];

const ROAD_ICONS = [
  { name: 'location-sharp', label: 'Pin Lokasi' },
  { name: 'map-sharp', label: 'Peta Jalan' },
  { name: 'compass-sharp', label: 'Kompas' },
  { name: 'navigate-sharp', label: 'Navigasi' },
  { name: 'pin-sharp', label: 'Tancap Pin' },
  { name: 'trail-sign-sharp', label: 'Plang Jalan' }
];

const PRESETS = {
  'Furnitur': [
    'https://loremflickr.com/500/500/wardrobe,plastic?lock=00',
    'https://loremflickr.com/500/500/woodendesk?lock=01',
    'https://loremflickr.com/500/500/foldingchair?lock=02'
  ],
  'Elektronik': [
    'https://loremflickr.com/500/500/laptop,asus?lock=10',
    'https://loremflickr.com/500/500/smartphone,xiaomi?lock=11',
    'https://loremflickr.com/500/500/deskfan,fan?lock=12'
  ],
  'Dapur': [
    'https://loremflickr.com/500/500/plates,kitchen?lock=20',
    'https://loremflickr.com/500/500/ricecooker?lock=21'
  ],
  'Perlengkapan Tidur': [
    'https://loremflickr.com/500/500/mattress,bed?lock=30',
    'https://loremflickr.com/500/500/bedsheet?lock=31'
  ],
  'Dekorasi': [
    'https://loremflickr.com/500/500/mirror,oval?lock=40',
    'https://loremflickr.com/500/500/canvas,painting?lock=41',
    'https://loremflickr.com/500/500/curtain,window?lock=42'
  ],
  'Alat Tulis': [
    'https://loremflickr.com/500/500/calculator?lock=50',
    'https://loremflickr.com/500/500/notebook,journal?lock=51',
    'https://loremflickr.com/500/500/binder,stationery?lock=52'
  ],
  'Fashion': [
    'https://loremflickr.com/500/500/sneakers,converse?lock=60',
    'https://loremflickr.com/500/500/sandals,outdoor?lock=61',
    'https://loremflickr.com/500/500/eyeglasses,frame?lock=62',
    'https://loremflickr.com/500/500/backpack,hiking?lock=63'
  ],
  'Kebersihan': [
    'https://loremflickr.com/500/500/microfiber,cloth?lock=70',
    'https://loremflickr.com/500/500/hanger,clothes?lock=71'
  ],
  'Peralatan': [
    'https://loremflickr.com/500/500/flashlight,led?lock=80',
    'https://loremflickr.com/500/500/clothesiron?lock=81',
    'https://loremflickr.com/500/500/powerstrip,socket?lock=82'
  ],
  'Aksesoris': [
    'https://loremflickr.com/500/500/waterbottle?lock=90',
    'https://loremflickr.com/500/500/thermos,bottle?lock=91'
  ]
};

export default function AddProductScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { addProduct } = useProducts();
  const { defaultAddress, defaultBiodata } = useOrders();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    category: 'Furnitur',
    price: '',
    stock: '1',
    description: '',
    address: `${defaultAddress?.name || ''} - ${defaultAddress?.address || ''}, ${defaultAddress?.city || ''}`.trim(),
    roadIcon: defaultAddress?.roadIcon || 'location-outline',
    thumbnail: PRESETS['Furnitur'][0]
  });

  // Ganti opsi gambar default otomatis saat kategori berubah
  useEffect(() => {
    const list = PRESETS[form.category];
    if (list && list.length > 0) {
      setForm(f => ({ ...f, thumbnail: list[0] }));
    }
  }, [form.category]);

  const [loading, setLoading] = useState(false);

  const handlePost = () => {
    if (!form.title.trim()) {
      Alert.alert('Eror', 'Nama barang wajib diisi.');
      return;
    }
    if (!form.price.trim() || isNaN(form.price) || Number(form.price) <= 0) {
      Alert.alert('Eror', 'Harga barang harus diisi dengan angka positif.');
      return;
    }
    if (!form.stock.trim() || isNaN(form.stock) || Number(form.stock) <= 0) {
      Alert.alert('Eror', 'Jumlah stok minimal 1.');
      return;
    }
    if (!form.description.trim()) {
      Alert.alert('Eror', 'Silakan isi deskripsi kondisi barang bekas Anda.');
      return;
    }
    if (!form.address.trim()) {
      Alert.alert('Eror', 'Silakan isi alamat lokasi pengambilan barang.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      addProduct({
        title: form.title.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        address: form.address.trim(),
        roadIcon: form.roadIcon,
        thumbnail: form.thumbnail,
        images: [form.thumbnail],
        sellerName: `${user?.firstName || 'Mahasiswa'} (Saya)`,
        sellerPhone: defaultBiodata?.phone || '081234567890',
        brand: 'Preloved Anak Kos'
      });

      setLoading(false);
      Alert.alert('Sukses', 'Iklan barang bekas Anda berhasil dipasang!', [
        { text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] }) }
      ]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.headerRow}>
          <AppButton
            icon="chevron-back"
            variant="secondary"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Jual Barang Bekas</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detail Barang Jualan</Text>

          <InputField
            label="Nama Barang"
            icon="cube-outline"
            placeholder="cth. Kipas Angin Cosmos Bekas"
            value={form.title}
            onChangeText={(text) => setForm(f => ({ ...f, title: text }))}
          />

          <Text style={styles.label}>Pilih Kategori:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={{ gap: spacing.sm }}>
            {CATEGORIES.map((cat) => {
              const isActive = form.category === cat;
              return (
                <Pressable
                  key={cat}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setForm(f => ({ ...f, category: cat }))}
                >
                  <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <InputField
            label="Harga Jual (Rupiah)"
            icon="cash-outline"
            keyboardType="number-pad"
            placeholder="cth. 75000"
            value={form.price}
            onChangeText={(text) => setForm(f => ({ ...f, price: text }))}
          />

          <InputField
            label="Jumlah Stok"
            icon="copy-outline"
            keyboardType="number-pad"
            placeholder="1"
            value={form.stock}
            onChangeText={(text) => setForm(f => ({ ...f, stock: text }))}
          />

          <InputField
            label="Deskripsi Kondisi Barang Bekas"
            icon="document-text-outline"
            placeholder="Jelaskan masa pemakaian, lecet, kelengkapan, alasan dijual, dll..."
            multiline
            numberOfLines={4}
            value={form.description}
            onChangeText={(text) => setForm(f => ({ ...f, description: text }))}
          />

          {/* Pilih Gambar Presets */}
          <Text style={styles.label}>Pilih Foto Barang Bekas (Ilustrasi Kategori):</Text>
          <View style={styles.imagePresetRow}>
            {PRESETS[form.category]?.map((url, idx) => {
              const isSelected = form.thumbnail === url;
              return (
                <Pressable
                  key={idx}
                  style={[styles.presetWrapper, isSelected && styles.presetWrapperActive]}
                  onPress={() => setForm(f => ({ ...f, thumbnail: url }))}
                >
                  <Image source={{ uri: url }} style={styles.presetImage} />
                  {isSelected && (
                    <View style={styles.checkOverlay}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.surface} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Lokasi/Alamat Pengambilan */}
          <InputField
            label="Lokasi Barang (Alamat Kos Anda)"
            icon="home-outline"
            placeholder="Nama Kosan, Jalan, No Kamar"
            multiline
            numberOfLines={2}
            value={form.address}
            onChangeText={(text) => setForm(f => ({ ...f, address: text }))}
          />

          {/* Pemilihan Ikon Jalan (serta semua icon jalan) */}
          <Text style={styles.label}>Pilih Ikon Jalan Lokasi Kos:</Text>
          <View style={styles.iconGrid}>
            {ROAD_ICONS.map((item) => {
              const isActive = form.roadIcon === item.name;
              return (
                <Pressable
                  key={item.name}
                  style={[styles.iconChip, isActive && styles.iconChipActive]}
                  onPress={() => setForm(f => ({ ...f, roadIcon: item.name }))}
                >
                  <Ionicons
                    name={isActive ? item.name : item.name.replace('-sharp', '-outline')}
                    size={22}
                    color={isActive ? colors.surface : colors.textMuted}
                  />
                  <Text style={[styles.iconLabel, isActive && styles.iconLabelActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <AppButton
            title="Pasang Iklan Jualan"
            icon="megaphone-outline"
            loading={loading}
            onPress={handlePost}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  backButton: { width: 42, height: 42, paddingHorizontal: 0, justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  scrollContent: { padding: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.xl,
    ...shadow.soft
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginBottom: spacing.md },
  label: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm },
  categoryScroll: { flexDirection: 'row', marginBottom: spacing.md },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryChipText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  categoryChipTextActive: { color: colors.surface, fontWeight: '700' },
  imagePresetRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  presetWrapper: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.primaryLight
  },
  presetWrapperActive: {
    borderColor: colors.primary
  },
  presetImage: { width: '100%', height: '100%' },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(91, 108, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  iconChip: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: 4
  },
  iconChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  iconLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600', textAlign: 'center' },
  iconLabelActive: { color: colors.surface }
});
