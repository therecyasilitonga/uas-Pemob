import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import StatusView from '../components/StatusView';
import { useWishlist } from '../context/WishlistContext';
import { rupiah } from '../components/ProductCard';
import { colors, spacing, typography, radius, shadow } from '../theme/theme';

export default function WishlistScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { items, removeFromWishlist } = useWishlist();

  const total = items.reduce((sum, p) => sum + p.price, 0);

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <ScreenHeader title="Wishlist Saya" subtitle={`${items.length} produk disimpan`} />
      </View>

      {items.length === 0 ? (
        <StatusView type="empty" message="Belum ada produk di wishlist. Tap ikon ♡ pada produk untuk menyimpannya di sini." />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.row}
                onPress={() => navigation.navigate('Home', { screen: 'ProductDetail', params: { productId: item.id } })}
              >
                <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
                <View style={styles.rowInfo}>
                  <Text style={styles.rowCategory}>{item.category}</Text>
                  <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.rowPrice}>{rupiah(item.price)}</Text>
                </View>
                <Pressable onPress={() => removeFromWishlist(item.id)} hitSlop={10} style={styles.removeBtn}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </Pressable>
            )}
          />
          <View style={[styles.summary, { paddingBottom: insets.bottom + spacing.md }]}>
            <Text style={styles.summaryLabel}>Estimasi Total</Text>
            <Text style={styles.summaryValue}>{rupiah(total)}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, gap: spacing.md },
  row: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', marginBottom: spacing.md, ...shadow.soft,
  },
  thumb: { width: 60, height: 60, borderRadius: radius.sm, backgroundColor: colors.primaryLight },
  rowInfo: { flex: 1, marginLeft: spacing.md },
  rowCategory: { ...typography.caption, textTransform: 'capitalize' },
  rowTitle: { ...typography.bodyBold, fontSize: 13, marginVertical: 2 },
  rowPrice: { color: colors.primaryDark, fontWeight: '800', fontSize: 13 },
  removeBtn: { padding: spacing.sm },
  summary: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg,
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
  },
  summaryLabel: { ...typography.body, color: colors.textMuted },
  summaryValue: { ...typography.h3, color: colors.primaryDark },
});
