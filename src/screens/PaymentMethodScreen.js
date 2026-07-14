import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrderContext';
import AppButton from '../components/AppButton';
import InputField from '../components/InputField';
import { colors, spacing, radius, shadow } from '../theme/theme';

export default function PaymentMethodScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { paymentMethods, togglePaymentMethodActive, addPaymentMethod } = useOrders();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodType, setNewMethodType] = useState('e-wallet'); // e-wallet | bank

  const handleAdd = () => {
    if (!newMethodName.trim()) {
      Alert.alert('Eror', 'Nama e-wallet/bank wajib diisi.');
      return;
    }

    addPaymentMethod({
      id: `custom_${Date.now()}`,
      name: newMethodName.trim(),
      type: newMethodType,
      balance: newMethodType === 'e-wallet' ? 100000 : undefined,
      active: false
    });

    setNewMethodName('');
    setShowAddForm(false);
    Alert.alert('Sukses', 'Metode pembayaran baru berhasil ditambahkan!');
  };

  const getIcon = (type, name) => {
    if (name.toLowerCase().includes('gopay')) return 'wallet-outline';
    if (name.toLowerCase().includes('shopeepay')) return 'wallet-outline';
    if (type === 'cash') return 'cash-outline';
    if (type === 'bank') return 'card-outline';
    return 'wallet-outline';
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
          <Text style={styles.headerTitle}>Metode Pembayaran</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pilih Metode Aktif</Text>
          <Text style={styles.sectionSubtitle}>
            Metode yang dipilih akan otomatis digunakan sebagai metode pembayaran utama saat checkout belanja.
          </Text>

          <View style={styles.list}>
            {paymentMethods.map((pm) => (
              <Pressable
                key={pm.id}
                style={[styles.item, pm.active && styles.itemActive]}
                onPress={() => togglePaymentMethodActive(pm.id)}
              >
                <View style={[styles.iconWrap, pm.active && styles.iconWrapActive]}>
                  <Ionicons
                    name={getIcon(pm.type, pm.name)}
                    size={20}
                    color={pm.active ? colors.surface : colors.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, pm.active && styles.itemNameActive]}>
                    {pm.name}
                  </Text>
                  {pm.balance !== undefined && (
                    <Text style={[styles.itemDetail, pm.active && styles.itemDetailActive]}>
                      Saldo: Rp{pm.balance.toLocaleString('id-ID')}
                    </Text>
                  )}
                  {pm.type === 'cash' && (
                    <Text style={[styles.itemDetail, pm.active && styles.itemDetailActive]}>
                      Bayar cash langsung saat serah terima barang
                    </Text>
                  )}
                  {pm.type === 'bank' && (
                    <Text style={[styles.itemDetail, pm.active && styles.itemDetailActive]}>
                      Transfer otomatis lewat Virtual Account
                    </Text>
                  )}
                </View>
                <View style={styles.radio}>
                  {pm.active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            ))}
          </View>

          {showAddForm ? (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Tambah E-Wallet / Bank Baru</Text>
              
              <InputField
                label="Nama Penyedia"
                icon="wallet-outline"
                placeholder="cth. OVO, DANA, Bank Mandiri"
                value={newMethodName}
                onChangeText={setNewMethodName}
              />

              <Text style={styles.typeLabel}>Tipe Pembayaran:</Text>
              <View style={styles.typeRow}>
                <Pressable
                  style={[styles.typeButton, newMethodType === 'e-wallet' && styles.typeButtonActive]}
                  onPress={() => setNewMethodType('e-wallet')}
                >
                  <Text style={[styles.typeBtnText, newMethodType === 'e-wallet' && styles.typeBtnTextActive]}>
                    E-Wallet
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.typeButton, newMethodType === 'bank' && styles.typeButtonActive]}
                  onPress={() => setNewMethodType('bank')}
                >
                  <Text style={[styles.typeBtnText, newMethodType === 'bank' && styles.typeBtnTextActive]}>
                    Transfer Bank
                  </Text>
                </Pressable>
              </View>

              <View style={styles.formActionRow}>
                <AppButton
                  title="Batal"
                  variant="secondary"
                  style={{ flex: 1 }}
                  onPress={() => setShowAddForm(false)}
                />
                <AppButton
                  title="Tambah"
                  style={{ flex: 1 }}
                  onPress={handleAdd}
                />
              </View>
            </View>
          ) : (
            <AppButton
              title="Hubungkan Metode Baru"
              icon="add-circle-outline"
              variant="secondary"
              onPress={() => setShowAddForm(true)}
              style={{ marginTop: spacing.md }}
            />
          )}
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
    ...shadow.soft
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: colors.textMuted, lineHeight: 17, marginBottom: spacing.lg },
  list: { gap: spacing.md, marginBottom: spacing.lg },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  itemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  iconWrapActive: {
    backgroundColor: colors.primary
  },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.text },
  itemNameActive: { color: colors.primaryDark },
  itemDetail: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  itemDetailActive: { color: colors.primary },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary
  },
  addForm: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface
  },
  formTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  typeLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: spacing.sm },
  typeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.background
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  typeBtnText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  typeBtnTextActive: { color: colors.primary, fontWeight: '700' },
  formActionRow: { flexDirection: 'row', gap: spacing.sm }
});
