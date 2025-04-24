export const formatPrice = (price) => {
    if (typeof price === "string") price = parseFloat(price);
    return price.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };