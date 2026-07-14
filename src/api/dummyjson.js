import { boardingHouseProducts } from './boardingHouseProducts';

// Lapisan Networking terpusat untuk KampusMarket yang dimodifikasi.
// Sekarang menyajikan data barang bekas anak kos secara lokal agar cepat,
// andal, dan bekerja secara offline penuh.

/** Ambil daftar produk (opsional limit/skip untuk pagination sederhana). */
export async function getProducts({ limit = 60, skip = 0 } = {}) {
  // Simulasi network delay sedikit agar terkesan mengambil data (UX premium)
  await new Promise(resolve => setTimeout(resolve, 300));
  return boardingHouseProducts.slice(skip, skip + limit);
}

/** Ambil daftar kategori produk. */
export async function getCategories() {
  await new Promise(resolve => setTimeout(resolve, 100));
  // Mengambil kategori unik dari daftar produk secara dinamis
  const categories = Array.from(new Set(boardingHouseProducts.map(p => p.category)));
  return categories;
}

/** Cari produk berdasarkan kata kunci. */
export async function searchProducts(query) {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (!query) return boardingHouseProducts;
  const q = query.toLowerCase().trim();
  return boardingHouseProducts.filter(
    p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

/** Ambil detail satu produk berdasarkan id. */
export async function getProductById(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const product = boardingHouseProducts.find(p => p.id === Number(id));
  if (!product) {
    throw new Error(`Produk dengan ID ${id} tidak ditemukan.`);
  }
  return product;
}

/**
 * Simulasi login memakai akun lokal agar tidak tergantung internet.
 */
export async function loginUser(username, password) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!username || !password) {
    throw new Error('Username dan password harus diisi.');
  }

  // Akun uji coba bawaan
  if (username.toLowerCase() === 'emilys' && password === 'emilyspass') {
    return {
      id: 1,
      username: 'emilys',
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily.johnson@x.dummyjson.com',
      image: 'https://api.dicebear.com/7.x/initials/png?seed=Emily',
    };
  }

  // Mendukung login dengan username apa saja dengan password minimal 6 karakter
  if (password.length >= 6) {
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
    return {
      id: Math.floor(Math.random() * 1000) + 10,
      username: username.toLowerCase().trim(),
      firstName: formattedName,
      lastName: 'Mahasiswa',
      email: `${username.toLowerCase()}@kampus.ac.id`,
      image: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(formattedName)}`,
    };
  }

  throw new Error('Password salah atau kurang dari 6 karakter.');
}

/**
 * Simulasi daftar akun baru secara lokal.
 */
export async function registerUser({ firstName, lastName, email, username, password }) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!firstName || !username || !password) {
    throw new Error('Mohon isi semua data wajib.');
  }

  return {
    id: Date.now(),
    firstName,
    lastName: lastName || '',
    email: email || `${username.toLowerCase()}@kampus.ac.id`,
    username: username.toLowerCase().trim(),
    image: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(firstName)}`,
  };
}
