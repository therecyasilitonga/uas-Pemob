import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/theme';

/**
 * Komponen tombol serbaguna & reusable.
 * variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 */
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}) {
  const isDisabled = disabled || loading;
  const variantStyle = styles[variant] || styles.primary;
  const textVariantStyle = textStyles[variant] || textStyles.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary} />
      ) : (
        <View style={styles.content}>
          {icon && <Ionicons name={icon} size={18} color={textVariantStyle.color} style={styles.icon} />}
          <Text style={[styles.text, textVariantStyle]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { marginRight: spacing.sm },
  text: { ...typography.bodyBold, fontSize: 15 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.textInverse },
  secondary: { color: colors.primary },
  outline: { color: colors.primary },
  ghost: { color: colors.primary },
  danger: { color: colors.textInverse },
});
