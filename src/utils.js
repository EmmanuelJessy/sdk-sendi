// src/utils.js
export const isEmpty = (value) => !value || value.trim() === '';

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+?[0-9]{8,15})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const cleanPhone = (phone) => phone.replace(/\s/g, '');

export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));