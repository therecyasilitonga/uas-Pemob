import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, shadow } from '../theme/theme';

const NOTIFS = [
  {
    id: '1',
    title: 'Pesanan Diproses Kurir Kampus 🚀',
    body: 'Barang "Meja Belajar Lesehan Kayu" Anda sedang dikemas dan siap diantarkan ke Kost Griya Cantika sore ini.',
    time: 'Baru saja',
    category: 'transaksi',
    unread: true
  },
  {
    id: '2',
    title: 'Promo Akhir Semester Anak Kos! 🎓',
    body: 'Diskon kilat s.d 40% barang-barang bekas berkualitas menjelang libur kuliah. Cari kasur, kipas, dan lemari murah sekarang!',
    time: '2 jam yang lalu',
    category: 'promo',
    unread: true
  },
  {
    id: '3',
    title: 'Tips Aman Transaksi COD Kosan 🛡️',
    body: 'Demi keamanan bersama, usahakan COD dilakukan di area lobi kosan, gerbang masuk, atau tempat ramai di sekitar kampus.',
    time: 'Kemarin',
    category: 'info',
    unread: false
  },
  {
    id: '4',
    title: 'Penurunan Harga Wishlist Anda! 📉',
    body: 'Barang "Laptop ASUS VivoBook" yang Anda simpan mengalami penurunan harga! Segera beli sebelum diambil anak kos lain.',
    time: '3 hari yang lalu',
    category: 'wishlist',
    unread: false
  }
];

export default function NotificationScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const getIcon = (cat) => {
    switch (cat) {
      case 'transaksi': return 'rocket-outline';
      case 'promo': return 'gift-outline';
      case 'wishlist': return 'heart-outline';
      default: return 'information-circle-outline';
    }
  };

  const getIconBg = (cat) => {
    switch (cat) {
      case 'transaksi': return colors.successLight;
      case 'promo': return colors.dangerLight;
      case 'wishlist': return colors.accentLight;
      default: return colors.primaryLight;
    }
  };

  const getIconColor = (cat) => {
    switch (cat) {
      case 'transaksi': return colors.success;
      case 'promo': return colors.danger;
      case 'wishlist': return colors.accent;
      default: return colors.primary;
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
          <Text style={styles.headerTitle}>Notifikasi</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <FlatList
        data={NOTIFS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, item.unread && styles.cardUnread]}>
            <View style={[styles.iconWrap, { backgroundColor: getIconBg(item.category) }]}>
              <Ionicons name={getIcon(item.category)} size={20} color={getIconColor(item.category)} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Tidak ada notifikasi baru.</Text>
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
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    ...shadow.soft,
    alignItems: 'flex-start',
    gap: spacing.md
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  cardTitle: { fontSize: 13.5, fontWeight: '800', color: colors.text, flex: 1 },
  time: { fontSize: 10, color: colors.textMuted },
  cardBody: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    alignSelf: 'center'
  },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 100, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' }
});
