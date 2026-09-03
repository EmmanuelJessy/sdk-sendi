// src/utils.js
export const isEmpty = (value) => {
  return value === null || value === undefined || value === '' || 
         (typeof value === 'string' && value.trim() === '');
};

export const isNotEmpty = (value) => !isEmpty(value);

export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, '');
  const phoneRegex = /^(\+?[0-9]{8,15})$/;
  return phoneRegex.test(cleaned);
};

export const cleanPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\s/g, '');
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = cleanPhone(phone);
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '+225 $1 $2 $3 $4 $5');
  }
  return cleaned;
};


export const formatPrice = (price, currency = 'FCFA') => {
  // Si c'est FCFA, on formate manuellement
  if (currency === 'FCFA' || currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' FCFA';
  }
  
  // Pour EUR, on utilise un format spécifique
  if (currency === 'EUR') {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' €';
  }
  
  // Pour les autres devises
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateId = () => {
  // ✅ S'assurer que l'ID fait 24 caractères
  const part1 = Math.random().toString(36).substring(2, 10);
  const part2 = Math.random().toString(36).substring(2, 10);
  const part3 = Math.random().toString(36).substring(2, 10);
  return part1 + part2 + part3;
};

export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const objectToQueryString = (obj) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  }
  return params.toString();
};

export const pick = (obj, keys) => {
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const omit = (obj, keys) => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};