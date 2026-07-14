import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { rupiah } from '../components/ProductCard';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, shadow } from '../theme/theme';

export default function OrderSuccessScreen({ route, navigation }) {
  const { order } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <View style={styles.successIconBox}>
          <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        </View>

        <Text style={styles.title}>Pembelian Berhasil!</Text>
        <Text style={styles.subtitle}>
          Pesanan barang bekas Anda telah terdaftar dan sedang dikonfirmasi oleh penjual kosan.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Nomor Pesanan</Text>
            <Text style={styles.value}>{order.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Barang</Text>
            <Text style={styles.value} numberOfLines={1}>{order.product.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Penerima</Text>
            <Text style={styles.value}>{order.recipientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Metode Pengiriman</Text>
            <Text style={styles.value}>{order.shippingMethod}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estimasi Tiba</Text>
            <Text style={[styles.value, { color: colors.primary, fontWeight: '700' }]}>
              {order.shippingEstimate}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, { fontWeight: '700', color: colors.text }]}>Total Pembayaran</Text>
            <Text style={[styles.value, { fontWeight: '800', color: colors.danger, fontSize: 15 }]}>
              {rupiah(order.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Petunjuk Langkah Berikutnya */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.infoText}>
            {order.shippingMethod.includes('COD') 
              ? 'Silakan hubungi penjual via nomor WhatsApp untuk bersepakat melakukan serah terima barang langsung.'
              : 'Silakan tunggu kurir mengantarkan barang langsung ke alamat kos Anda.'}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <AppButton
          title="Lihat Daftar Pembelian (Dibeli)"
          icon="list-outline"
          variant="primary"
          onPress={() => {
            // Arahkan ke OrderHistoryScreen
            navigation.replace('OrderHistory');
          }}
        />
        <AppButton
          title="Kembali ke Beranda"
          icon="home-outline"
          variant="secondary"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }]
            });
          }}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  content: { flex: 1, alignItems: 'center' },
  successIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadow.soft
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12.5, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.sm, lineHeight: 18 },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
    ...shadow.soft
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, color: colors.textMuted },
  value: { fontSize: 12, fontWeight: '700', color: colors.text, maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xl,
    marginHorizontal: spacing.sm
  },
  infoText: { fontSize: 11, color: colors.primaryDark, flex: 1, lineHeight: 16 },
  footer: { width: '100%', paddingHorizontal: spacing.sm }
});
