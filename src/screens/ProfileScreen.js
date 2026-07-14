import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';
import { colors, spacing, typography, radius, shadow } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { count } = useWishlist();
  const { orders } = useOrders();
  const { userProductsCount } = useProducts();

  const confirmLogout = () => {
    Alert.alert('Keluar Akun', 'Apakah Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profil', route: 'EditProfile' },
    { icon: 'pricetag-outline', label: 'Mulai Jualan (Tambah Produk)', route: 'AddProduct' },
    { icon: 'location-outline', label: 'Alamat Pengiriman', route: 'ShippingAddress' },
    { icon: 'card-outline', label: 'Metode Pembayaran', route: 'PaymentMethod' },
    { icon: 'notifications-outline', label: 'Notifikasi', route: 'Notification' },
    { icon: 'help-circle-outline', label: 'Pusat Bantuan', route: 'HelpCenter' },
    { icon: 'information-circle-outline', label: 'Tentang KampusMarket', route: 'About' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
        <Image
          source={{ uri: user?.image || 'https://api.dicebear.com/7.x/initials/png?seed=User' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <Pressable style={styles.statCard} onPress={() => navigation.navigate('Wishlist')}>
          <Text style={styles.statValue}>{count}</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </Pressable>
        <Pressable 
          style={styles.statCard} 
          onPress={() => Alert.alert('Informasi Jualan', `Anda memiliki ${userProductsCount} iklan barang bekas aktif di katalog.`)}
        >
          <Text style={styles.statValue}>{userProductsCount}</Text>
          <Text style={styles.statLabel}>Terjual</Text>
        </Pressable>
        <Pressable style={styles.statCard} onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Dibeli</Text>
        </Pressable>
      </View>

      <View style={styles.menuCard}>
        {menuItems.map((item, idx) => (
          <Pressable
            key={item.label}
            style={[styles.menuItem, idx === menuItems.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutText}>Keluar Akun</Text>
      </Pressable>

      <Text style={styles.footerNote}>KampusMarket v1.0.0 • UAS Pemrograman Mobile</Text>
      <View style={{ height: insets.bottom + spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    alignItems: 'center', paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl,
  },
  avatar: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', marginBottom: spacing.md, backgroundColor: '#fff' },
  name: { ...typography.h2, color: colors.textInverse, fontSize: 19 },
  username: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  email: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginTop: -30, gap: spacing.md },
  statCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, alignItems: 'center',
    paddingVertical: spacing.lg, ...shadow.card,
  },
  statValue: { ...typography.h3, color: colors.primaryDark, fontSize: 20 },
  statLabel: { ...typography.caption, marginTop: 2 },
  menuCard: {
    backgroundColor: colors.surface, marginHorizontal: spacing.lg, marginTop: spacing.xl,
    borderRadius: radius.md, ...shadow.soft,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  menuLabel: { flex: 1, ...typography.body, fontSize: 13.5 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.dangerLight,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  logoutText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
  footerNote: { textAlign: 'center', color: colors.textMuted, fontSize: 11, marginTop: spacing.xl },
});
