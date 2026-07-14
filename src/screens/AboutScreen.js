import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, shadow } from '../theme/theme';

export default function AboutScreen({ navigation }) {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.headerTitle}>Tentang KampusMarket</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>KM</Text>
          </View>

          <Text style={styles.appName}>KampusMarket</Text>
          <Text style={styles.appVersion}>Versi 1.0.0 (Beta)</Text>

          <View style={styles.divider} />

          <Text style={styles.description}>
            KampusMarket adalah aplikasi marketplace terpercaya yang dirancang khusus untuk memfasilitasi transaksi jual-beli barang bekas berkualitas di kalangan mahasiswa. 
            {"\n\n"}
            Dengan KampusMarket, mahasiswa yang ingin lulus atau pindah kos dapat dengan mudah menjual barang-barang yang tidak terpakai lagi (seperti lemari, kasur, kipas angin, buku binder, cermin, peralatan dapur, dsb.) ke mahasiswa lain yang sedang membutuhkan dengan metode COD atau Kurir Kampus yang murah dan aman.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.infoTitle}>Tugas UAS Pemrograman Mobile</Text>
          <Text style={styles.infoDetail}>
            Dikembangkan untuk membantu siklus ekonomi mahasiswa dan mengurangi limbah barang bekas kosan di lingkungan sekitar kampus.
          </Text>

          <Text style={styles.copyright}>© 2026 KampusMarket Team. All Rights Reserved.</Text>
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
    alignItems: 'center',
    ...shadow.soft
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.soft
  },
  logoText: { color: colors.surface, fontSize: 28, fontWeight: '800' },
  appName: { fontSize: 18, fontWeight: '800', color: colors.text },
  appVersion: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, width: '100%', marginVertical: spacing.lg },
  description: { fontSize: 12.5, color: colors.textMuted, lineHeight: 18, textAlign: 'justify' },
  infoTitle: { fontSize: 12, fontWeight: '800', color: colors.text, alignSelf: 'flex-start' },
  infoDetail: { fontSize: 11, color: colors.textMuted, alignSelf: 'flex-start', marginTop: 4, lineHeight: 16 },
  copyright: { fontSize: 9, color: colors.textMuted, marginTop: spacing.xxl }
});
