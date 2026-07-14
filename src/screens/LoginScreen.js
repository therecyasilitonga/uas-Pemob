import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm, hasErrors } from '../utils/validation';
import { colors, spacing, typography, radius } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: 'emilys', password: 'emilyspass' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleLogin = async () => {
    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);
    setApiError('');
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      // Navigasi ditangani otomatis oleh RootNavigator saat isAuthenticated berubah.
    } catch (err) {
      setApiError(err.message || 'Login gagal. Periksa username & password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.hero}>
        <View style={[styles.heroContent, { paddingTop: insets.top + spacing.xl }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>KM</Text>
          </View>
          <Text style={styles.brand}>KampusMarket</Text>
          <Text style={styles.tagline}>Jual-beli barang bekas mahasiswa, gampang & terpercaya</Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.welcomeTitle}>Selamat Datang 👋</Text>
          <Text style={styles.welcomeSubtitle}>Masuk untuk mulai belanja & jualan</Text>

          <InputField
            label="Username"
            icon="person-outline"
            placeholder="cth. emilys"
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

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          <AppButton title="Masuk" onPress={handleLogin} loading={loading} icon="log-in-outline" style={{ marginTop: spacing.sm }} />

          <View style={styles.hintBox}>
            <Text style={styles.hintText}>
              💡 Akun uji coba dari DummyJSON sudah terisi otomatis. Anda juga bisa memakai akun lain dari{' '}
              <Text style={{ fontWeight: '700' }}>dummyjson.com/users</Text>.
            </Text>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.divider} />
          </View>

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
            <Text style={styles.registerText}>Belum punya akun? </Text>
            <Text style={styles.registerLink}>Daftar di sini</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { paddingBottom: 70 },
  heroContent: { alignItems: 'center', paddingHorizontal: spacing.xl },
  logoCircle: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  logoText: { color: colors.textInverse, fontSize: 24, fontWeight: '800' },
  brand: { ...typography.h1, color: colors.textInverse, marginBottom: spacing.xs },
  tagline: { color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontSize: 13, lineHeight: 18 },
  formContainer: { flexGrow: 1, paddingHorizontal: spacing.lg, marginTop: -50, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: '#1B1D2A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  welcomeTitle: { ...typography.h2, marginBottom: 4 },
  welcomeSubtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },
  apiErrorBox: {
    backgroundColor: colors.dangerLight, borderRadius: radius.sm,
    padding: spacing.md, marginBottom: spacing.md,
  },
  apiErrorText: { color: colors.danger, fontSize: 12.5, fontWeight: '600' },
  hintBox: {
    backgroundColor: colors.primaryLight, borderRadius: radius.md,
    padding: spacing.md, marginTop: spacing.lg,
  },
  hintText: { fontSize: 12, color: colors.primaryDark, lineHeight: 17 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.md },
  divider: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: spacing.md, color: colors.textMuted, fontSize: 12 },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { color: colors.textMuted, fontSize: 13 },
  registerLink: { color: colors.primary, fontSize: 13, fontWeight: '700' },
});
