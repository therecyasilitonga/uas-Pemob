import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrderContext';
import { rupiah } from '../components/ProductCard';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, shadow } from '../theme/theme';

export default function OrderHistoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Diproses': return colors.primary;
      case 'Dikirim': return colors.warning;
      case 'Selesai': return colors.success;
      default: return colors.textMuted;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Diproses': return colors.primaryLight;
      case 'Dikirim': return colors.warningLight;
      case 'Selesai': return colors.successLight;
      default: return colors.background;
    }
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
          <Text style={styles.headerTitle}>Riwayat Pembelian</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.productRow}>
              <Image source={{ uri: item.product.thumbnail }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.productCategory}>{item.product.category}</Text>
                <Text style={styles.productTitle} numberOfLines={2}>{item.product.title}</Text>
                <Text style={styles.productPrice}>{rupiah(item.product.price)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>Penerima: {item.recipientName} ({item.recipientPhone})</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name={item.shippingAddress.roadIcon || 'location-outline'} size={14} color={colors.primary} />
                <Text style={styles.infoText} numberOfLines={2}>
                  Alamat: <Text style={{ fontWeight: '700' }}>{item.shippingAddress.name}</Text> - {item.shippingAddress.address}, {item.shippingAddress.city} ({item.shippingAddress.detail})
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="airplane-outline" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>
                  Pengiriman: {item.shippingMethod} (Est: {item.shippingEstimate})
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="card-outline" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>Pembayaran: {item.paymentMethod}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footerRow}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.totalLabel}>
                Total Bayar: <Text style={styles.totalValue}>{rupiah(item.totalAmount)}</Text>
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Belum ada barang yang dibeli.</Text>
            <Text style={styles.emptySubtext}>Cari barang bekas kosan incaranmu di Beranda dan lakukan checkout.</Text>
          </View>
        }
      />
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
  listContent: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    ...shadow.soft
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  statusText: { fontSize: 10, fontWeight: '800' },
  divider: { height: 1, backgroundColor: colors.border, my: spacing.sm, marginVertical: spacing.sm },
  productRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.primaryLight },
  productCategory: { fontSize: 10, textTransform: 'capitalize', color: colors.textMuted, fontWeight: '600' },
  productTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginVertical: 2 },
  productPrice: { fontSize: 13, fontWeight: '800', color: colors.primaryDark },
  infoSection: { gap: 6, marginVertical: 4 },
  infoItem: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', paddingRight: spacing.md },
  infoText: { fontSize: 11.5, color: colors.text, lineHeight: 16, flex: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  dateText: { fontSize: 10, color: colors.textMuted },
  totalLabel: { fontSize: 11, color: colors.textMuted },
  totalValue: { fontSize: 13.5, fontWeight: '800', color: colors.primaryDark },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 100, gap: spacing.md, paddingHorizontal: spacing.xl },
  emptyText: { color: colors.textMuted, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  emptySubtext: { color: colors.textMuted, fontSize: 11.5, textAlign: 'center', lineHeight: 17 }
});
