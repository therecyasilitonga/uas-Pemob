import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrderContext';
import InputField from '../components/InputField';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, shadow } from '../theme/theme';

const ROAD_ICONS = [
  { name: 'location-sharp', label: 'Pin Lokasi' },
  { name: 'map-sharp', label: 'Peta Jalan' },
  { name: 'compass-sharp', label: 'Kompas' },
  { name: 'navigate-sharp', label: 'Navigasi' },
  { name: 'pin-sharp', label: 'Tancap Pin' },
  { name: 'trail-sign-sharp', label: 'Plang Jalan' }
];

export default function ShippingAddressScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { defaultAddress, updateDefaultAddress } = useOrders();

  const [form, setForm] = useState({
    name: defaultAddress?.name || '',
    address: defaultAddress?.address || '',
    city: defaultAddress?.city || '',
    detail: defaultAddress?.detail || '',
    roadIcon: defaultAddress?.roadIcon || 'map-outline'
  });

  const handleSave = () => {
    if (!form.name.trim() || !form.address.trim()) {
      Alert.alert('Eror', 'Nama kos/penerima dan alamat lengkap wajib diisi.');
      return;
    }

    updateDefaultAddress(form);
    Alert.alert('Sukses', 'Alamat pengiriman default berhasil diperbarui!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.headerRow}>
          <AppButton
            icon="chevron-back"
            variant="secondary"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Alamat Pengiriman</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ubah Alamat Kosan</Text>
          
          <InputField
            label="Nama Kosan / Label Alamat"
            icon="home-outline"
            placeholder="cth. Kost Griya Cantika"
            value={form.name}
            onChangeText={(text) => setForm(f => ({ ...f, name: text }))}
          />

          <InputField
            label="Alamat Lengkap Jalan"
            icon="business-outline"
            placeholder="Nama jalan, nomor, gang, RT/RW"
            multiline
            numberOfLines={3}
            value={form.address}
            onChangeText={(text) => setForm(f => ({ ...f, address: text }))}
          />

          <InputField
            label="Kota & Provinsi"
            icon="earth-outline"
            placeholder="cth. Depok, Jawa Barat"
            value={form.city}
            onChangeText={(text) => setForm(f => ({ ...f, city: text }))}
          />

          <InputField
            label="Detail Keterangan (Patokan / Nomor Kamar)"
            icon="information-circle-outline"
            placeholder="cth. Kamar B3, lantai 2, pager warna biru"
            value={form.detail}
            onChangeText={(text) => setForm(f => ({ ...f, detail: text }))}
          />

          {/* Pemilihan Ikon Jalan (serta semua icon jalan) */}
          <Text style={styles.label}>Pilih Ikon Jalan/Lokasi Penunjuk:</Text>
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
            title="Simpan Alamat"
            icon="save-outline"
            onPress={handleSave}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </ScrollView>
    </View>
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
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginBottom: spacing.lg },
  label: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.md },
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
