export const formatCurrency = (value) => {
  if (value === undefined || value === null) return "N/A";
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  });
  
  return formatter.format(value);
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null) return "N/A";
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  });
  
  return formatter.format(value / 100);
};

export const formatLargeNumber = (value) => {
  if (value === undefined || value === null) return "N/A";
  
  const tiers = [
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' },
  ];
  
  const tier = tiers.find(tier => Math.abs(value) >= tier.threshold);
  
  if (tier) {
    const formatted = (value / tier.threshold).toFixed(2);
    return `$${formatted}${tier.suffix}`;
  }
  
  return formatCurrency(value);
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (timestamp) => {
  if (!timestamp) return "N/A";
  
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};