import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';
import { colors, spacing, typography } from '../theme/theme';

/**
 * Komponen reusable untuk menampilkan status jaringan secara jelas:
 * loading (sedang memuat), error (gagal tanpa membuat app crash),
 * dan empty (data kosong).
 */
export default function StatusView({ type = 'loading', message, onRetry }) {
  if (type === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>{message || 'Sedang memuat data...'}</Text>
      </View>
    );
  }

  if (type === 'error') {
    return (
      <View style={styles.container}>
        <View style={styles.iconCircleError}>
          <Ionicons name="cloud-offline-outline" size={30} color={colors.danger} />
        </View>
        <Text style={styles.title}>Gagal memuat data</Text>
        <Text style={styles.message}>{message || 'Periksa koneksi internet Anda dan coba lagi.'}</Text>
        {onRetry && (
          <AppButton title="Coba Lagi" onPress={onRetry} variant="outline" fullWidth={false} style={styles.retryBtn} icon="refresh" />
        )}
      </View>
    );
  }

  // empty
  return (
    <View style={styles.container}>
      <View style={styles.iconCircleEmpty}>
        <Ionicons name="search-outline" size={30} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>Tidak ada data</Text>
      <Text style={styles.message}>{message || 'Belum ada produk yang cocok.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  title: { ...typography.h3, marginTop: spacing.md, marginBottom: spacing.xs },
  message: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  iconCircleError: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.dangerLight,
    alignItems: 'center', justifyContent: 'center',
  },
  iconCircleEmpty: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  retryBtn: { marginTop: spacing.lg, paddingHorizontal: spacing.xxl },
});
