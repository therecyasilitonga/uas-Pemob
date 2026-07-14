import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrderContext';
import { rupiah } from '../components/ProductCard';
import AppButton from '../components/AppButton';
import InputField from '../components/InputField';
import { colors, spacing, radius, shadow } from '../theme/theme';

const SHIPPING_METHODS = [
  { id: 'cod', name: 'Ambil Sendiri / COD Kosan', cost: 0, estimate: 'Hari ini (Kontak Penjual)' },
  { id: 'kurir_kampus', name: 'Kurir Kampus (Hemat)', cost: 8000, estimate: 'Hari yang sama / Besok' },
  { id: 'ojol', name: 'Ojek Online (Instant)', cost: 15000, estimate: '1-2 Jam' },
  { id: 'reguler', name: 'JNE / J&T Reguler', cost: 10000, estimate: '1-2 Hari kerja' }
];

export default function CheckoutScreen({ route, navigation }) {
  const { product } = route.params;
  const insets = useSafeAreaInsets();
  
  const {
    defaultAddress,
    defaultBiodata,
    paymentMethods,
    addOrder,
    updateDefaultBiodata
  } = useOrders();

  const activePayment = paymentMethods.find(pm => pm.active) || paymentMethods[0];

  const [recipient, setRecipient] = useState({
    name: defaultBiodata?.name || '',
    phone: defaultBiodata?.phone || ''
  });

  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [loading, setLoading] = useState(false);

  const price = product.price;
  const shippingCost = shippingMethod.cost;
  const appServiceFee = 1000;
  const totalAmount = price + shippingCost + appServiceFee;

  const handlePlaceOrder = () => {
    if (!recipient.name.trim() || !recipient.phone.trim()) {
      Alert.alert('Eror', 'Nama Penerima dan Nomor Telepon wajib diisi.');
      return;
    }

    if (!defaultAddress.address.trim()) {
      Alert.alert('Eror', 'Silakan lengkapi alamat pengiriman kosan Anda terlebih dahulu.');
      return;
    }

    setLoading(true);

    // Update biodata di OrderContext jika ada perubahan
    updateDefaultBiodata(recipient);

    setTimeout(() => {
      const newOrder = {
        product: {
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          category: product.category
        },
        recipientName: recipient.name.trim(),
        recipientPhone: recipient.phone.trim(),
        shippingAddress: { ...defaultAddress },
        shippingMethod: shippingMethod.name,
        shippingEstimate: shippingMethod.estimate,
        shippingCost: shippingCost,
        appServiceFee: appServiceFee,
        paymentMethod: activePayment.name,
        totalAmount: totalAmount
      };

      addOrder(newOrder);
      setLoading(false);

      // Navigasi ke sukses pembelian
      navigation.navigate('OrderSuccess', {
        order: newOrder
      });
    }, 1200);
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
          <Text style={styles.headerTitle}>Checkout Belanja</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Detail Penerima / Biodata */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Biodata Penerima</Text>
          <InputField
            label="Nama Penerima"
            icon="person-outline"
            placeholder="Nama lengkap penerima"
            value={recipient.name}
            onChangeText={(text) => setRecipient(r => ({ ...r, name: text }))}
          />
          <InputField
            label="Nomor WhatsApp"
            icon="call-outline"
            keyboardType="phone-pad"
            placeholder="cth. 0812XXXXXXXX"
            value={recipient.phone}
            onChangeText={(text) => setRecipient(r => ({ ...r, phone: text }))}
          />
        </View>

        {/* Alamat Pengiriman */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alamat Pengiriman (Kos Anda)</Text>
            <Pressable onPress={() => navigation.navigate('ShippingAddress')} hitSlop={10}>
              <Text style={styles.linkText}>Ubah</Text>
            </Pressable>
          </View>
          <View style={styles.addressBox}>
            <View style={styles.addressHeaderRow}>
              <Ionicons name={defaultAddress.roadIcon || 'location-outline'} size={18} color={colors.primary} />
              <Text style={styles.addressLabel}>{defaultAddress.name}</Text>
            </View>
            <Text style={styles.addressText}>
              {defaultAddress.address}, {defaultAddress.city}
            </Text>
            {defaultAddress.detail ? (
              <Text style={styles.addressDetail}>
                Detail: {defaultAddress.detail}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Info Produk */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Barang yang Dibeli</Text>
          <View style={styles.productRow}>
            <Image source={{ uri: product.thumbnail }} style={styles.productThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
              <Text style={styles.productPrice}>{rupiah(product.price)}</Text>
            </View>
          </View>
          <View style={styles.sellerBadge}>
            <Ionicons name="storefront-outline" size={13} color={colors.textMuted} />
            <Text style={styles.sellerText}>Penjual: {product.sellerName}</Text>
          </View>
        </View>

        {/* Pilihan Estimasi Pengiriman */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pilih Opsi Pengiriman</Text>
          <View style={styles.shippingList}>
            {SHIPPING_METHODS.map((sm) => {
              const isSelected = shippingMethod.id === sm.id;
              return (
                <Pressable
                  key={sm.id}
                  style={[styles.shippingItem, isSelected && styles.shippingItemActive]}
                  onPress={() => setShippingMethod(sm)}
                >
                  <View style={styles.shippingInfo}>
                    <Text style={[styles.shippingName, isSelected && styles.shippingNameActive]}>
                      {sm.name}
                    </Text>
                    <Text style={styles.shippingEst}>Estimasi: {sm.estimate}</Text>
                  </View>
                  <Text style={[styles.shippingCost, isSelected && styles.shippingCostActive]}>
                    {sm.cost === 0 ? 'Gratis' : rupiah(sm.cost)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Metode Pembayaran */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
            <Pressable onPress={() => navigation.navigate('PaymentMethod')} hitSlop={10}>
              <Text style={styles.linkText}>Ubah</Text>
            </Pressable>
          </View>
          <View style={styles.paymentBox}>
            <Ionicons name={activePayment.type === 'bank' ? 'card-outline' : 'wallet-outline'} size={18} color={colors.primary} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.paymentName}>{activePayment.name}</Text>
              {activePayment.balance !== undefined ? (
                <Text style={styles.paymentDetail}>
                  (Saldo: Rp{activePayment.balance.toLocaleString('id-ID')})
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Ringkasan Pembayaran */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ringkasan Pembayaran</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Harga Barang</Text>
            <Text style={styles.summaryValue}>{rupiah(price)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ongkos Kirim</Text>
            <Text style={styles.summaryValue}>{shippingCost === 0 ? 'Rp0' : rupiah(shippingCost)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Biaya Layanan Aplikasi</Text>
            <Text style={styles.summaryValue}>{rupiah(appServiceFee)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Tagihan</Text>
            <Text style={styles.totalValue}>{rupiah(totalAmount)}</Text>
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Button Bayar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total Pembayaran</Text>
          <Text style={styles.footerPrice}>{rupiah(totalAmount)}</Text>
        </View>
        <AppButton
          title="Bayar Sekarang"
          icon="shield-checkmark-outline"
          loading={loading}
          onPress={handlePlaceOrder}
          style={styles.payBtn}
        />
      </View>
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
  scrollContent: { padding: spacing.lg, gap: spacing.md },
  sectionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    ...shadow.soft
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 13.5, fontWeight: '800', color: colors.primaryDark, marginBottom: spacing.sm },
  linkText: { fontSize: 12, color: colors.primary, fontWeight: '700' },
  addressBox: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.background
  },
  addressHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  addressLabel: { fontSize: 12.5, fontWeight: '700', color: colors.text },
  addressText: { fontSize: 11.5, color: colors.textMuted, lineHeight: 16 },
  addressDetail: { fontSize: 11, color: colors.primary, marginTop: 4, fontWeight: '600' },
  productRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  productThumb: { width: 60, height: 60, borderRadius: radius.sm, backgroundColor: colors.primaryLight },
  productCategory: { fontSize: 10, textTransform: 'capitalize', color: colors.textMuted, fontWeight: '600' },
  productTitle: { fontSize: 12.5, fontWeight: '700', color: colors.text, marginVertical: 2 },
  productPrice: { fontSize: 12.5, fontWeight: '800', color: colors.primaryDark },
  sellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  sellerText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  shippingList: { gap: spacing.sm },
  shippingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  shippingItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  shippingInfo: { flex: 1, marginRight: spacing.sm },
  shippingName: { fontSize: 12.5, fontWeight: '700', color: colors.text },
  shippingNameActive: { color: colors.primaryDark },
  shippingEst: { fontSize: 10.5, color: colors.textMuted, marginTop: 2 },
  shippingCost: { fontSize: 12.5, fontWeight: '800', color: colors.text },
  shippingCostActive: { color: colors.primaryDark },
  paymentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  paymentName: { fontSize: 13, fontWeight: '700', color: colors.text },
  paymentDetail: { fontSize: 11, color: colors.textMuted },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  summaryLabel: { fontSize: 11.5, color: colors.textMuted },
  summaryValue: { fontSize: 11.5, color: colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 16, fontWeight: '800', color: colors.danger },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md
  },
  footerInfo: { flex: 1 },
  footerLabel: { fontSize: 10.5, color: colors.textMuted },
  footerPrice: { fontSize: 16, fontWeight: '800', color: colors.danger },
  payBtn: { flex: 1.2 },
  methodIcon: { width: 32, height: 32, borderRadius: radius.sm, marginRight: spacing.sm }
});
