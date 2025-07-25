export const validationUtils = {

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  validatePassword: (password: string): boolean => {
    return password.length >= 6;
  },

  validateStrongPassword: (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  validateFullName: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  validateUsername: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  validatePhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  getEmailError: (email: string): string => {
    if (!email.trim()) return "Email wajib diisi";
    if (!validationUtils.validateEmail(email)) return "Format email tidak valid";
    return "";
  },

  getPasswordError: (password: string): string => {
    if (!password) return "Password wajib diisi";
    if (!validationUtils.validatePassword(password)) return "Password minimal 6 karakter";
    return "";
  },

  getFullNameError: (name: string): string => {
    if (!name.trim()) return "Nama lengkap wajib diisi";
    if (!validationUtils.validateFullName(name)) return "Nama minimal 2 karakter";
    return "";
  },

  getConfirmPasswordError: (password: string, confirmPassword: string): string => {
    if (!confirmPassword) return "Konfirmasi password wajib diisi";
    if (password !== confirmPassword) return "Password tidak cocok";
    return "";
  }
};
