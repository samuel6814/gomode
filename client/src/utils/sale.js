import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';

export function isOnSale(product, sale) {
  return Boolean(sale?.active && product && sale.productIds?.includes(product.id));
}

export function saleUnitPrice(product, sale) {
  if (!product) return 0;
  if (!isOnSale(product, sale)) return product.price;
  const percent = Number(sale.discountPercent) || 0;
  return Math.round(product.price * (1 - percent / 100) * 100) / 100;
}

export function useSale() {
  const { data } = useQuery({
    queryKey: ['storefrontSale'],
    queryFn: async () => (await apiClient.get('/sales')).data,
    staleTime: 60 * 1000,
  });
  return data?.data;
}
