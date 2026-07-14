import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import CategoryChip from '../components/CategoryChip';
import StatusView from '../components/StatusView';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { colors, spacing, typography, radius, shadow } from '../theme/theme';

const DEBOUNCE_MS = 250;

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { products } = useProducts();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setRefreshing(false);
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ['all', ...list];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch =
        !debouncedSearch ||
        p.title.toLowerCase().includes(debouncedSearch) ||
        p.category.toLowerCase().includes(debouncedSearch) ||
        p.description.toLowerCase().includes(debouncedSearch);
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, debouncedSearch]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={[styles.hero, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.greeting}>Halo, {user?.firstName || 'Mahasiswa'} 👋</Text>
            <Text style={styles.heroTitle}>Cari barang bekas{'\n'}incaranmu di sini</Text>
          </View>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari produk, misal: laptop, tas..."
            placeholderTextColor={colors.textMuted}
            value={searchInput}
            onChangeText={setSearchInput}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <Pressable onPress={() => setSearchInput('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      {categories.length > 1 && (
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => (
            <CategoryChip
              label={item === 'all' ? 'Semua' : item}
              active={activeCategory === item}
              onPress={() => setActiveCategory(item)}
            />
          )}
        />
      )}

      <Text style={styles.resultCount}>
        {filteredProducts.length} produk ditemukan
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isWishlisted={isInWishlist(item.id)}
            onToggleWishlist={() => toggleWishlist(item)}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        ListEmptyComponent={
          <StatusView
            type="empty"
            message={`Tidak ada produk untuk "${searchInput}". Coba kata kunci lain.`}
          />
        }
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
      />

      {/* Floating Action Button (FAB) Jual */}
      <View style={[styles.fabContainer, { bottom: insets.bottom + spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={22} color={colors.surface} />
            <Text style={styles.fabText}>Jual</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerContainer: { width: '100%' },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTopRow: { marginBottom: spacing.lg },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 4 },
  heroTitle: { ...typography.h1, color: colors.textInverse, fontSize: 22, lineHeight: 28 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, paddingVertical: 0 },
  chipRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  resultCount: { ...typography.caption, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  listContent: { paddingBottom: spacing.xxl },
  columnWrapper: { paddingHorizontal: spacing.sm },
  fabContainer: {
    position: 'absolute',
    right: spacing.lg,
    borderRadius: radius.pill,
    ...shadow.card,
    overflow: 'hidden',
  },
  fab: {
    borderRadius: radius.pill,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 22,
    gap: spacing.xs,
  },
  fabText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
});
