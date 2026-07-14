import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow, typography } from '../theme/theme';

const rupiah = (val) => {
  if (!val) return 'Rp0';
  const formatted = Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return 'Rp' + formatted;
};


/**
 * Kartu produk reusable dipakai di Katalog & Wishlist.
 * Dipakai berulang kali supaya tampilan grid tetap konsisten.
 */
export default function ProductCard({ product, onPress, onToggleWishlist, isWishlisted }) {
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
        <Pressable
          onPress={onToggleWishlist}
          hitSlop={8}
          style={styles.heartButton}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={16}
            color={isWishlisted ? colors.accent : colors.textMuted}
          />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.brand} numberOfLines={1}>{product.category}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{rupiah(product.price)}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color={colors.warning} />
            <Text style={styles.ratingText}>{product.rating?.toFixed ? product.rating.toFixed(1) : product.rating}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    margin: spacing.sm,
    ...shadow.card,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  imageWrapper: { width: '100%', aspectRatio: 1, backgroundColor: colors.primaryLight },
  image: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  discountText: { color: colors.textInverse, fontSize: 10, fontWeight: '800' },
  heartButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  info: { padding: spacing.md },
  brand: { ...typography.caption, textTransform: 'capitalize', marginBottom: 2 },
  title: { ...typography.bodyBold, fontSize: 13, minHeight: 34, lineHeight: 17 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  price: { ...typography.bodyBold, fontSize: 13.5, color: colors.primaryDark },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 11, color: colors.textMuted, marginLeft: 2, fontWeight: '600' },
});

export { rupiah };
