import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../components/AppButton';
import { colors, spacing, radius, shadow } from '../theme/theme';

const FAQS = [
  {
    question: 'Bagaimana cara melakukan COD (Cash on Delivery) di KampusMarket?',
    answer: 'Untuk transaksi COD, pilih opsi pengiriman "Ambil Sendiri / COD Kosan" saat melakukan checkout. Setelah pesanan dikonfirmasi oleh penjual, hubungi nomor kontak penjual yang tertera di detail barang untuk bersepakat menentukan waktu dan lokasi bertemu. Disarankan bertemu di lobi kosan atau area terbuka kampus yang ramai.'
  },
  {
    question: 'Apa itu metode pengiriman Kurir Kampus?',
    answer: 'Kurir Kampus adalah layanan pengantaran barang khusus mahasiswa yang dikelola oleh komunitas KampusMarket. Layanan ini menawarkan biaya yang sangat terjangkau (flat rate) dan estimasi tiba pada hari yang sama atau keesokan harinya langsung ke kamar kos Anda.'
  },
  {
    question: 'Apakah barang bekas yang sudah dibeli bisa dikembalikan?',
    answer: 'Kebijakan pengembalian tergantung pada kesepakatan dengan penjual saat COD. Disarankan Anda memeriksa kondisi barang secara teliti (seperti mencoba barang elektronik, mengecek kebersihan kasur/gorden, memeriksa kestabilan meja/lemari) sebelum melakukan pembayaran final.'
  },
  {
    question: 'Bagaimana cara mendaftarkan barang bekas milik saya untuk dijual?',
    answer: 'Saat ini KampusMarket versi beta difokuskan untuk pembeli. Fitur pendaftaran barang dan jualan bagi mahasiswa secara langsung sedang dalam proses pengembangan untuk rilis pembaruan berikutnya.'
  }
];

export default function HelpCenterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === idx ? null : idx);
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
          <Text style={styles.headerTitle}>Pusat Bantuan</Text>
          <View style={{ width: 42 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.helpHero}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.primary} />
            <Text style={styles.heroTitle}>Ada yang bisa kami bantu?</Text>
            <Text style={styles.heroSubtitle}>Cari jawaban cepat untuk kendala belanja barang bekas Anda di bawah ini</Text>
          </View>

          <Text style={styles.faqHeading}>Pertanyaan Populer</Text>

          <View style={styles.faqList}>
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <Pressable
                  key={idx}
                  style={[styles.faqItem, isExpanded && styles.faqItemExpanded]}
                  onPress={() => toggleExpand(idx)}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.textMuted}
                    />
                  </View>
                  {isExpanded && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.contactCard}>
            <Ionicons name="logo-whatsapp" size={24} color={colors.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>Butuh Bantuan Lebih Lanjut?</Text>
              <Text style={styles.contactSubtitle}>Hubungi Customer Service KampusMarket via WhatsApp</Text>
            </View>
            <AppButton
              title="Chat WA"
              style={styles.waBtn}
              onPress={() => Alert.alert('Simulasi', 'Membuka chat WhatsApp Layanan Pelanggan KampusMarket...')}
            />
          </View>
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
  helpHero: { alignItems: 'center', textAlign: 'center', marginBottom: spacing.xl },
  heroTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  heroSubtitle: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 16 },
  faqHeading: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  faqList: { gap: spacing.md },
  faqItem: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background
  },
  faqItemExpanded: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  faqQuestion: { fontSize: 12.5, fontWeight: '700', color: colors.text, flex: 1, lineHeight: 17 },
  faqAnswer: { fontSize: 11.5, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 17 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    marginTop: spacing.xl
  },
  contactTitle: { fontSize: 12, fontWeight: '800', color: colors.success },
  contactSubtitle: { fontSize: 10, color: colors.textMuted, marginTop: 2, lineHeight: 14 },
  waBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.sm, backgroundColor: colors.success }
});
