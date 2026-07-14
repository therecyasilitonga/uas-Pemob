#KampusMarket

Aplikasi mobile marketplace jual-beli barang bekas mahasiswa — dibangun dengan
**React Native + Expo SDK 54.0.8**, memakai API publik [DummyJSON](https://dummyjson.com)
untuk data produk & simulasi login.
<img width="738" height="1600" alt="image" src="https://github.com/user-attachments/assets/a67317ec-1850-4565-87a2-c920268fc721" />


Dibuat untuk memenuhi **UAS Praktikum Pemrograman Mobile**.

---

##Cara Menjalankan (Expo Go)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Jalankan development server**
   ```bash
   npx expo start
   ```

3. **Buka di HP kamu**
   - Install aplikasi **Expo Go** dari Play Store / App Store (pastikan versi Expo Go mendukung **SDK 54**).
   - Scan QR code yang muncul di terminal/browser memakai aplikasi Expo Go (Android) atau Camera app (iOS).
   - Pastikan HP dan komputer berada di **jaringan WiFi yang sama**.

> Jika QR tidak bisa discan (beda jaringan), jalankan `npx expo start --tunnel`.

### Akun uji coba (sudah terisi otomatis di form Login)
```
Username: emilys
Password: emilyspass
```
Akun lain bisa dilihat di https://dummyjson.com/users

---

## Checklist Ketentuan Wajib UAS

| # | Ketentuan | Implementasi |
|---|---|---|
| 1 | **Layout (Flexbox)** | 3 halaman utama (Login, Katalog, Detail Produk) full Flexbox, responsive di semua ukuran layar via `SafeAreaProvider` + `Dimensions`. |
| 2 | **Komponen reusable** | `AppButton`, `InputField`, `ProductCard`, `CategoryChip`, `StatusView`, `ScreenHeader` — dipakai berulang di banyak halaman. |
| 3 | **Lists** | `FlatList` 2 kolom untuk katalog produk, dengan `initialNumToRender`, `windowSize`, `removeClippedSubviews` untuk performa. |
| 4 | **State & Hooks** | Search **debounced** (`useState`+`useEffect`+`useRef`) + filter kategori pakai `useMemo`, tanpa lag saat mengetik. |
| 5 | **Form & Validasi** | Login & Register dengan validasi nama, format email (regex), panjang password, konfirmasi password (`src/utils/validation.js`). |
| 6 | **Navigasi** | Bottom tab (Home, Wishlist, Profil) via `@react-navigation/bottom-tabs`, Home→Detail via nested stack. Auth-gate: `RootNavigator` menukar seluruh stack berdasarkan status login (`AuthContext`), sehingga tab utama tidak bisa diakses sebelum login. |
| 7 | **Networking & API** | Semua fetch di `src/api/dummyjson.js` dengan timeout + error handling rapi. Setiap layar menampilkan status **loading / success / error** secara eksplisit lewat komponen `StatusView`, plus tombol **Coba Lagi** dan **pull-to-refresh**. |

## Struktur Folder

```
KampusMarket/
├── App.js                     # Entry point, bungkus semua provider
├── src/
│   ├── api/dummyjson.js       # Semua request ke DummyJSON API
│   ├── context/
│   │   ├── AuthContext.js     # State login + persist via AsyncStorage
│   │   └── WishlistContext.js # State wishlist/keranjang
│   ├── components/            # Komponen reusable
│   ├── navigation/
│   │   ├── RootNavigator.js       # Auth-gate (Login/Register vs Main)
│   │   ├── MainTabNavigator.js    # Bottom tab: Home, Wishlist, Profil
│   │   └── HomeStackNavigator.js  # Katalog -> Detail Produk
│   ├── screens/                # Login, Register, Home, ProductDetail, Wishlist, Profile
│   ├── theme/theme.js          # Design tokens (warna, spacing, radius, tipografi)
│   └── utils/validation.js     # Validasi form
└── package.json
```

## Fitur Tambahan (nilai plus)
- Desain modern dengan gradient header, kartu produk dengan badge diskon & rating.
- Debounced search supaya UI tetap mulus.
- Pull-to-refresh di halaman Katalog.
- Sesi login tersimpan otomatis (AsyncStorage) — tidak perlu login ulang tiap buka app.
- Wishlist dengan estimasi total harga.
- Semua harga dikonversi otomatis ke Rupiah.

## 📦 Versi Utama
- `expo`: 54.0.8
- `react-native`: 0.81.4
- `react`: 19.1.0
- `@react-navigation/*`: v7
