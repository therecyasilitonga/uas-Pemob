// Utility validasi form: dipakai bersama di Login & Register
// supaya aturan validasi konsisten dan tidak duplikat.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm({ username, password }) {
  const errors = {};
  if (!username || !username.trim()) {
    errors.username = 'Username wajib diisi';
  }
  if (!password) {
    errors.password = 'Password wajib diisi';
  } else if (password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
  }
  return errors;
}

export function validateRegisterForm({ firstName, lastName, email, username, password, confirmPassword }) {
  const errors = {};
  if (!firstName || !firstName.trim()) {
    errors.firstName = 'Nama depan wajib diisi';
  }
  if (!lastName || !lastName.trim()) {
    errors.lastName = 'Nama belakang wajib diisi';
  }
  if (!email || !email.trim()) {
    errors.email = 'Email wajib diisi';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Format email tidak valid';
  }
  if (!username || !username.trim()) {
    errors.username = 'Username wajib diisi';
  } else if (username.trim().length < 4) {
    errors.username = 'Username minimal 4 karakter';
  }
  if (!password) {
    errors.password = 'Password wajib diisi';
  } else if (password.length < 6) {
    errors.password = 'Password minimal 6 karakter';
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = 'Konfirmasi password tidak cocok';
  }
  return errors;
}

export const hasErrors = (errorsObj) => Object.keys(errorsObj).length > 0;
