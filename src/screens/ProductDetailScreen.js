import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import StatusView from '../components/StatusView';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { rupiah } from '../components/ProductCard';
import { colors, spacing, typography, radius, shadow } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const insets = useSafeAreaInsets();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getProductById } = useProducts();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  const loadProduct = useCallback(() => {
    setStatus('loading');
    try {
      const data = getProductById(productId);
      if (!data) {
        throw new Error('Produk bekas tidak ditemukan.');
      }
      setProduct(data);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat detail produk.');
      setStatus('error');
    }
  }, [productId, getProductById]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <StatusView type="loading" message="Sedang memuat detail produk..." />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <StatusView type="error" message={errorMsg} onRetry={loadProduct} />
      </View>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageSection}>
          <Image source={{ uri: images[activeImage] }} style={styles.mainImage} resizeMode="cover" />
          <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
            <Pressable onPress={() => navigation.goBack()} style={styles.circleButton} hitSlop={10}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => toggleWishlist(product)} style={styles.circleButton} hitSlop={10}>
              <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={20} color={wishlisted ? colors.accent : colors.text} />
            </Pressable>
          </View>

          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbRow}
              contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
            >
              {images.map((img, idx) => (
                <Pressable key={idx} onPress={() => setActiveImage(idx)}>
                  <Image
                    source={{ uri: img }}
                    style={[styles.thumb, activeImage === idx && styles.thumbActive]}
                  />
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{product.category}</Text>
            </View>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionBadgeText}>Preloved Anak Kos</Text>
            </View>
            {product.stock > 0 ? (
              <View style={styles.stockBadgeIn}>
                <Text style={styles.stockTextIn}>Stok: {product.stock}</Text>
              </View>
            ) : (
              <View style={styles.stockBadgeOut}>
                <Text style={styles.stockTextOut}>Habis Terjual</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{product.rating} • {product.brand || 'Tanpa merek'}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{rupiah(product.price)}</Text>
            {product.discountPercentage > 0 && (
              <View style={styles.discountPill}>
                <Text style={styles.discountPillText}>Hemat {Math.round(product.discountPercentage)}%</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionLabel}>Deskripsi Barang</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          {/* Seller and Location Section */}
          <Text style={styles.sectionLabel}>Lokasi & Kontak Penjual</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerHeader}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>
                  {product.sellerName ? product.sellerName.charAt(0) : 'M'}
                </Text>
              </View>
              <View style={{ flex: 1, marginRight: spacing.xs }}>
                <Text style={styles.sellerNameText} numberOfLines={1}>{product.sellerName}</Text>
                <Text style={styles.sellerPhoneText}>{product.sellerPhone}</Text>
              </View>
              <Pressable
                style={styles.chatButton}
                onPress={() => Alert.alert('Simulasi WA', `Membuka obrolan WhatsApp dengan ${product.sellerName} (${product.sellerPhone})...`)}
              >
                <Ionicons name="logo-whatsapp" size={15} color={colors.success} />
                <Text style={styles.chatButtonText}>Chat WA</Text>
              </Pressable>
            </View>

            <View style={styles.locationBox}>
              <View style={styles.locationHeader}>
                <Ionicons name={product.roadIcon || 'location-outline'} size={18} color={colors.primary} />
                <Text style={styles.locationTitle}>Alamat Penjual (Kost)</Text>
              </View>
              <Text style={styles.addressText}>{product.address}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaGrid}>
            <MetaItem icon="cube-outline" label="Kategori" value={product.category} />
            <MetaItem icon="shield-checkmark-outline" label="Garansi Pelapak" value="Cek pas COD (Garansi Personal 3 Hari)" />
            <MetaItem icon="return-down-back-outline" label="Kebijakan Retur" value="Bisa dinegosiasikan saat serah terima di kos" />
            <MetaItem icon="rocket-outline" label="Opsi Kirim" value="COD Kosan / Kurir Kampus / Ojek Online" />
          </View>
        </View>
      </ScrollView>

      {/* Footer dengan tombol Beli Sekarang dan Wishlist */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.footerButtons}>
          <Pressable
            onPress={() => toggleWishlist(product)}
            style={[styles.wishlistIconBtn, wishlisted && styles.wishlistIconBtnActive]}
            hitSlop={8}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={wishlisted ? colors.accent : colors.textMuted}
            />
          </Pressable>
          <AppButton
            title="Beli Sekarang"
            icon="cart-outline"
            variant="primary"
            style={styles.buyNowBtn}
            onPress={() => {
              if (product.stock <= 0) {
                Alert.alert('Habis', 'Stok barang bekas ini sudah habis terjual.');
                return;
              }
              navigation.navigate('Checkout', { product });
            }}
          />
        </View>
      </View>
    </View>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaIconWrap}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue} numberOfLines={2}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  imageSection: { backgroundColor: colors.primaryLight },
  mainImage: { width, height: width * 0.85 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg,
  },
  circleButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', ...shadow.soft,
  },
  thumbRow: { position: 'absolute', bottom: spacing.md, left: 0, right: 0 },
  thumb: { width: 52, height: 52, borderRadius: radius.sm, borderWidth: 2, borderColor: 'transparent' },
  thumbActive: { borderColor: colors.textInverse },
  body: { padding: spacing.lg, paddingBottom: 120 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  categoryBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  categoryBadgeText: { color: colors.primaryDark, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  conditionBadge: { backgroundColor: colors.warningLight, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  conditionBadgeText: { color: colors.warning, fontSize: 11, fontWeight: '700' },
  stockBadgeIn: { backgroundColor: colors.successLight, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  stockTextIn: { color: colors.success, fontSize: 11, fontWeight: '700' },
  stockBadgeOut: { backgroundColor: colors.dangerLight, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  stockTextOut: { color: colors.danger, fontSize: 11, fontWeight: '700' },
  title: { ...typography.h2, marginBottom: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md, flexWrap: 'wrap' },
  ratingText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
  price: { fontSize: 24, fontWeight: '800', color: colors.primaryDark },
  discountPill: { backgroundColor: colors.accentLight, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  discountPillText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  sectionLabel: { ...typography.h3, fontSize: 15, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textMuted, lineHeight: 21, marginBottom: spacing.lg },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
  metaGrid: { gap: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  metaIconWrap: {
    width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  metaLabel: { fontSize: 11, color: colors.textMuted },
  metaValue: { fontSize: 13, fontWeight: '600', color: colors.text, textTransform: 'capitalize' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  wishlistIconBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  wishlistIconBtnActive: {
    borderColor: colors.accentLight,
    backgroundColor: colors.accentLight
  },
  buyNowBtn: {
    flex: 1
  },
  sellerCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sellerAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark
  },
  sellerNameText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text
  },
  sellerPhoneText: {
    fontSize: 11.5,
    color: colors.textMuted
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.successLight
  },
  chatButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success
  },
  locationBox: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  locationTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.text
  },
  addressText: {
    fontSize: 11.5,
    color: colors.textMuted,
    lineHeight: 16
  }
});
