import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme/theme';

/**
 * Kolom input reusable dengan label, icon, validasi error, dan
 * dukungan toggle "lihat password".
 */
export default function InputField({
  label,
  icon,
  error,
  secureTextEntry,
  containerStyle,
  ...textInputProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={error ? colors.danger : isFocused ? colors.primary : colors.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.bodyBold, fontSize: 13, marginBottom: spacing.sm, color: colors.text },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputWrapperFocused: { borderColor: colors.primary },
  inputWrapperError: { borderColor: colors.danger },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, ...typography.body, fontSize: 15, color: colors.text, paddingVertical: 0 },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: 4 },
  errorText: { color: colors.danger, fontSize: 12, marginLeft: 4 },
});
