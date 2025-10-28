export const formatPrice = (price: number, priceUnit: string): string => {
  if (priceUnit === "PER_SQM" || priceUnit === "PER_MONTH") {
    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1)} triệu/${priceUnit === "PER_SQM" ? "m²" : "tháng"}`;
    }
    return `${price.toLocaleString()} VND/${priceUnit === "PER_SQM" ? "m²" : "tháng"}`;
  }

  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(2)} tỷ`;
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(0)} triệu`;
  }
  return `${price.toLocaleString()} VND`;
};

export const formatArea = (area: number): string => {
  return `${area} m²`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

export const formatAddress = (address: any): string => {
  const parts = [
    address?.street,
    address?.ward,
    address?.district,
    address?.province,
  ].filter(Boolean);
  return parts.join(", ");
};
