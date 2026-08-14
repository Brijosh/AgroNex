const { clsx } = require("clsx");
const { twMerge } = require("tailwind-merge");

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function formatCurrency(amount, currency = "INR") {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(value, decimals = 0) {
  if (value === undefined || value === null || isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
  }).format(value);
}

function convertAcresToHectares(acres) {
  return (parseFloat(acres) || 0) * 0.404686;
}

function convertHectaresToAcres(hectares) {
  return (parseFloat(hectares) || 0) * 2.47105;
}

module.exports = {
  cn,
  formatCurrency,
  formatNumber,
  convertAcresToHectares,
  convertHectaresToAcres,
};
