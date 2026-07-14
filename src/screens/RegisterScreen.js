import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import InputField from '../components/InputField';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm, hasErrors } from '../utils/validation';
import { colors, spacing, typography, radius } from '../theme/theme';

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleRegister = async () => {
    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);
    setApiError('');
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setApiError(err.message || 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingTop: insets.top }}>
        <ScreenHeader title="Daftar Akun" subtitle="Gabung dengan KampusMarket" onBack={() => navigation.goBack()} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.row2}>
            <InputField
              label="Nama Depan"
              icon="person-outline"
              placeholder="Budi"
              value={form.firstName}
              onChangeText={(v) => setField('firstName', v)}
              error={errors.firstName}
              containerStyle={styles.halfInput}
            />
            <InputField
              label="Nama Belakang"
              icon="person-outline"
              placeholder="Santoso"
              value={form.lastName}
              onChangeText={(v) => setField('lastName', v)}
              error={errors.lastName}
              containerStyle={styles.halfInput}
            />
          </View>
          <InputField
            label="Email"
            icon="mail-outline"
            placeholder="budi@kampus.ac.id"
            autoCapitalize="none"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(v) => setField('email', v)}
            error={errors.email}
          />
          <InputField
            label="Username"
            icon="at-outline"
            placeholder="budisantoso"
            autoCapitalize="none"
            value={form.username}
            onChangeText={(v) => setField('username', v)}
            error={errors.username}
          />
          <InputField
            label="Password"
            icon="lock-closed-outline"
            placeholder="Minimal 6 karakter"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => setField('password', v)}
            error={errors.password}
          />
          <InputField
            label="Konfirmasi Password"
            icon="lock-closed-outline"
            placeholder="Ulangi password"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(v) => setField('confirmPassword', v)}
            error={errors.confirmPassword}
          />

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          <AppButton title="Daftar Sekarang" onPress={handleRegister} loading={loading} icon="checkmark-circle-outline" />

          <Text style={styles.note}>
            Dengan mendaftar, data Anda akan dikirim ke API publik DummyJSON sebagai simulasi pendaftaran.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  row2: { flexDirection: 'row', gap: spacing.md },
  halfInput: { flex: 1 },
  apiErrorBox: {
    backgroundColor: colors.dangerLight, borderRadius: radius.sm,
    padding: spacing.md, marginBottom: spacing.md,
  },
  apiErrorText: { color: colors.danger, fontSize: 12.5, fontWeight: '600' },
  note: { ...typography.caption, textAlign: 'center', marginTop: spacing.lg, lineHeight: 16, paddingHorizontal: spacing.md },
});
