const KEY = 'buyy-guest-cart';

export function readGuestCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('guest-cart'));
}

export function guestCartCount() {
  return readGuestCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function clearGuestCart() {
  writeGuestCart([]);
}

export function addGuestItem(product, quantity = 1) {
  const items = readGuestCart();
  const existing = items.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id: product.id,
      productId: product.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        images: product.images,
      },
    });
  }
  writeGuestCart(items);
}

function sameLine(item, id) {
  return item.id === id || item.productId === id || item.cjVariantId === id;
}

export function setGuestQty(id, quantity) {
  const items = quantity <= 0
    ? readGuestCart().filter((item) => !sameLine(item, id))
    : readGuestCart().map((item) => (sameLine(item, id) ? { ...item, quantity } : item));
  writeGuestCart(items);
}

export function removeGuestItem(id) {
  writeGuestCart(readGuestCart().filter((item) => !sameLine(item, id)));
}

export function linePath(item) {
  if (item?.source === 'cj' || item?.product?.source === 'cj') {
    return `/cj/${item.product?.id || ''}`;
  }
  return `/product/${item?.product?.id || item?.productId || ''}`;
}

export async function addToCart(apiClient, session, product, quantity = 1) {
  if (session) {
    await apiClient.post('/cart', { productId: product.id, quantity });
    return;
  }
  addGuestItem(product, quantity);
}

export function addGuestCjItem(product, variant, quantity = 1) {
  const items = readGuestCart();
  const existing = items.find((item) => item.cjVariantId === variant.id);
  const label = variant.optionLabel ? `${product.name} (${variant.optionLabel})` : product.name;
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id: variant.id,
      source: 'cj',
      cjVariantId: variant.id,
      productId: null,
      quantity,
      product: {
        id: product.id,
        source: 'cj',
        name: label,
        price: variant.cediPrice,
        stock: 99,
        images: product.imageUrl ? [{ image: { url: product.imageUrl } }] : [],
      },
    });
  }
  writeGuestCart(items);
}

export async function addCjToCart(apiClient, session, product, variant, quantity = 1) {
  if (session) {
    await apiClient.post('/cart', { source: 'cj', cjVariantId: variant.id, quantity });
    return;
  }
  addGuestCjItem(product, variant, quantity);
}

export async function mergeGuestCart(apiClient) {
  const items = readGuestCart();
  if (!items.length) return;
  await Promise.all(items.map((item) => apiClient.post('/cart', item.cjVariantId
    ? { source: 'cj', cjVariantId: item.cjVariantId, quantity: item.quantity }
    : { productId: item.productId, quantity: item.quantity })));
  clearGuestCart();
}
