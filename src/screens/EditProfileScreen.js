import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import InputField from '../components/InputField';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { colors, spacing, radius } from '../theme/theme';

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const { defaultBiodata, updateDefaultBiodata } = useOrders();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: defaultBiodata?.phone || '081298765432'
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.firstName.trim()) {
      Alert.alert('Eror', 'Nama depan tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      // Perbarui user auth
      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim()
      });

      // Perbarui default biodata di OrderContext
      updateDefaultBiodata({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        phone: form.phone.trim()
      });

      Alert.alert('Sukses', 'Profil Anda berhasil diperbarui!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.headerRow}>
          <AppButton
            icon="chevron-back"
            variant="secondary"
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Edit Profil</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarDecor}>
              <Ionicons name="person" size={44} color={colors.primary} />
            </View>
            <Text style={styles.avatarHint}>Foto Profil diambil otomatis dari inisial Anda</Text>
          </View>

          <InputField
            label="Nama Depan"
            icon="person-outline"
            value={form.firstName}
            onChangeText={(text) => setForm(f => ({ ...f, firstName: text }))}
          />

          <InputField
            label="Nama Belakang"
            icon="person-outline"
            value={form.lastName}
            onChangeText={(text) => setForm(f => ({ ...f, lastName: text }))}
          />

          <InputField
            label="E-mail"
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => setForm(f => ({ ...f, email: text }))}
          />

          <InputField
            label="Nomor Telepon (WhatsApp)"
            icon="call-outline"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => setForm(f => ({ ...f, phone: text }))}
          />

          <AppButton
            title="Simpan Perubahan"
            icon="save-outline"
            loading={loading}
            onPress={handleSave}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    shadowColor: '#1B1D2A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  avatarContainer: { alignItems: 'center', marginBottom: spacing.xl },
  avatarDecor: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  avatarHint: { fontSize: 11, color: colors.textMuted, textAlign: 'center' }
});
