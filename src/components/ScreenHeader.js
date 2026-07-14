import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../theme/theme';

/** Header gradient reusable dipakai di beberapa halaman utama. */
export default function ScreenHeader({ title, subtitle, onBack, right }) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={20} color={colors.textInverse} />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {right || <View style={styles.backButtonPlaceholder} />}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  backButtonPlaceholder: { width: 36, height: 36 },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { ...typography.h3, color: colors.textInverse, fontSize: 17 },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
});
