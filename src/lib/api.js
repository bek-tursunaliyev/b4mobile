import { supabase } from "./supabaseClient";
import { getInitData } from "./telegram";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// ==================================================
// MAPPERS (db snake_case -> app camelCase)
// ==================================================

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : null,
    stock: row.stock,
    rating: row.rating ? Number(row.rating) : 0,
    reviews: row.reviews || 0,
    image: row.image,
    description: row.description,
    specs: row.specs || [],
    isActive: row.is_active,
    phoneFinderEnabled: row.phone_finder_enabled || false,
    segment: row.segment || "",
    ramGb: row.ram_gb ?? "",
    storageGb: row.storage_gb ?? "",
    os: row.os || "",
    primaryUses: row.primary_uses || [],
    cameraScore: row.camera_score ?? "",
    performanceScore: row.performance_score ?? "",
    batteryScore: row.battery_score ?? "",
    displayScore: row.display_score ?? "",
    gamingScore: row.gaming_score ?? "",
    chargingScore: row.charging_score ?? "",
    softwareScore: row.software_score ?? "",
    refreshRateHz: row.refresh_rate_hz ?? "",
    batteryCapacityMah: row.battery_capacity_mah ?? "",
    chipset: row.chipset || "",
    deliveryAvailable: row.delivery_available ?? true,
    deliveryPrice: row.delivery_price != null ? Number(row.delivery_price) : null,
    warranty: row.warranty || "",
    costPrice: row.cost_price != null ? Number(row.cost_price) : null,
    currency: row.currency === "USD" ? "USD" : "UZS",
  };
}

// Columns safe to expose to the storefront (excludes cost_price, which is
// only for the admin's own profit tracking and must never reach customers).
const PUBLIC_PRODUCT_COLUMNS =
  "id, name, brand, category, price, old_price, stock, rating, reviews, image, " +
  "description, specs, is_active, phone_finder_enabled, segment, ram_gb, storage_gb, os, " +
  "primary_uses, camera_score, performance_score, battery_score, display_score, gaming_score, " +
  "charging_score, software_score, refresh_rate_hz, battery_capacity_mah, chipset, " +
  "delivery_available, delivery_price, warranty, currency, created_at";

function mapBanner(row) {
  return {
    id: row.id,
    image: row.image,
    title: row.title,
    text: row.subtitle,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapOrder(row) {
  return {
    id: row.id,
    orderCode: row.order_code,
    fullName: row.customer_name,
    phone: row.phone,
    region: row.region,
    address: row.address,
    note: row.note,
    paymentMethod: row.payment_method,
    items: row.items,
    subtotal: Number(row.subtotal),
    deliveryPrice: Number(row.delivery_price),
    total: Number(row.total),
    currency: row.currency === "USD" ? "USD" : "UZS",
    telegramUserId: row.telegram_user_id,
    telegramUsername: row.telegram_username,
    status: row.status,
    createdAt: row.created_at,
    isInstallment: row.is_installment || false,
    installmentMonths: row.installment_months ?? null,
    installmentMonthlyAmount: row.installment_monthly_amount
      ? Number(row.installment_monthly_amount)
      : null,
    installmentCurrency: row.installment_currency === "USD" ? "USD" : "UZS",
    pickedUpAt: row.picked_up_at || null,
  };
}

function mapTradeIn(row) {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    condition: row.condition,
    ram: row.ram,
    storage: row.storage,
    batteryHealth: row.battery_health,
    isBroken: row.is_broken,
    hasScratches: row.has_scratches,
    hasBox: row.has_box,
    note: row.note,
    image: row.image,
    status: row.status,
    offeredPrice: row.offered_price ? Number(row.offered_price) : null,
    offeredPriceCurrency: row.offered_price_currency === "USD" ? "USD" : "UZS",
    telegramUserId: row.telegram_user_id,
    telegramUsername: row.telegram_username,
    createdAt: row.created_at,
  };
}

// ==================================================
// PUBLIC STOREFRONT
// ==================================================

export async function getProducts({ limit } = {}) {
  let query = supabase
    .from("products")
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProduct(data) : null;
}

export async function getPhoneFinderQuestions() {
  const res = await fetch(`${FUNCTIONS_URL}/phone-finder-questions`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Savollarni yuklab bo'lmadi");
  return json;
}

export async function getPhoneFinderRecommendations(answers) {
  const res = await fetch(`${FUNCTIONS_URL}/phone-finder-recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Tavsiyalarni olib bo'lmadi");
  return json.results || [];
}

export async function getBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapBanner);
}

export async function createOrder(payload) {
  const res = await fetch(`${FUNCTIONS_URL}/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, initData: getInitData() }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Buyurtma yuborilmadi");
  return json;
}

// ==================================================
// MY ACCOUNT (current Telegram user, no admin rights needed)
// ==================================================

export async function getMyOrders() {
  const initData = getInitData();

  if (!initData) {
    return { ok: false, user: null, orders: [] };
  }

  const res = await fetch(`${FUNCTIONS_URL}/my-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });

  const json = await res.json();
  if (!res.ok) {
    return { ok: false, user: null, orders: [] };
  }

  return {
    ok: true,
    user: json.user,
    orders: (json.orders || []).map(mapOrder),
  };
}

export async function getMyTradeIns() {
  const initData = getInitData();

  if (!initData) {
    return { ok: false, requests: [] };
  }

  const res = await fetch(`${FUNCTIONS_URL}/my-trade-ins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });

  const json = await res.json();
  if (!res.ok) {
    return { ok: false, requests: [] };
  }

  return { ok: true, requests: (json.requests || []).map(mapTradeIn) };
}

export async function submitTradeIn(payload, file) {
  const initData = getInitData();

  if (!initData) {
    throw new Error("Bu funksiya faqat Telegram orqali ochilganda ishlaydi");
  }

  let imagePayload = {};

  if (file) {
    const fileBase64 = await fileToBase64(file);
    imagePayload = {
      imageBase64: fileBase64,
      imageFileName: file.name,
      imageContentType: file.type,
    };
  }

  const res = await fetch(`${FUNCTIONS_URL}/submit-trade-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, ...imagePayload, initData }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "So‘rov yuborilmadi");
  return json;
}

// ==================================================
// ADMIN
// ==================================================

async function adminRequest(fn, { method = "GET", id, params, body } = {}) {
  const url = new URL(`${FUNCTIONS_URL}/${fn}`);
  if (id !== undefined) url.searchParams.set("id", id);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": getInitData(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "So‘rov bajarilmadi");
  return json;
}

export async function verifyAdmin() {
  const res = await fetch(`${FUNCTIONS_URL}/telegram-verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: getInitData() }),
  });

  if (!res.ok) return { ok: false, isAdmin: false, user: null };
  return res.json();
}

export async function adminGetProducts() {
  const { products } = await adminRequest("admin-products");
  return products.map(mapProduct);
}

export async function adminCreateProduct(product) {
  const { product: created } = await adminRequest("admin-products", {
    method: "POST",
    body: product,
  });
  return mapProduct(created);
}

export async function adminUpdateProduct(id, updates) {
  const { product: updated } = await adminRequest("admin-products", {
    method: "PATCH",
    id,
    body: updates,
  });
  return mapProduct(updated);
}

export async function adminDeleteProduct(id) {
  return adminRequest("admin-products", { method: "DELETE", id });
}

export async function adminGetBanners() {
  const { banners } = await adminRequest("admin-banners");
  return banners.map(mapBanner);
}

export async function adminCreateBanner(banner) {
  const { banner: created } = await adminRequest("admin-banners", {
    method: "POST",
    body: banner,
  });
  return mapBanner(created);
}

export async function adminUpdateBanner(id, updates) {
  const { banner: updated } = await adminRequest("admin-banners", {
    method: "PATCH",
    id,
    body: updates,
  });
  return mapBanner(updated);
}

export async function adminDeleteBanner(id) {
  return adminRequest("admin-banners", { method: "DELETE", id });
}

export async function adminGetOrders() {
  const { orders } = await adminRequest("admin-orders");
  return orders.map(mapOrder);
}

export async function adminUpdateOrderStatus(id, status) {
  const { order } = await adminRequest("admin-orders", {
    method: "PATCH",
    id,
    body: { status },
  });
  return mapOrder(order);
}

export async function adminGetOrderByCode(code) {
  const { order } = await adminRequest("admin-orders", {
    method: "GET",
    params: { code },
  });
  return order ? mapOrder(order) : null;
}

export async function adminSetInstallmentTerms(id, months, monthlyAmount, currency = "UZS") {
  const { order } = await adminRequest("admin-orders", {
    method: "PATCH",
    id,
    body: {
      isInstallment: true,
      installmentMonths: months,
      installmentMonthlyAmount: monthlyAmount,
      installmentCurrency: currency,
    },
  });
  return mapOrder(order);
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function adminUploadImage(file, folder = "products") {
  const fileBase64 = await fileToBase64(file);

  const res = await fetch(`${FUNCTIONS_URL}/admin-upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-telegram-init-data": getInitData(),
    },
    body: JSON.stringify({
      fileBase64,
      fileName: file.name,
      contentType: file.type,
      folder,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Rasm yuklanmadi");
  return json.url;
}

export async function adminGetTradeIns() {
  const { requests } = await adminRequest("admin-trade-ins");
  return requests.map(mapTradeIn);
}

export async function adminUpdateTradeIn(id, updates) {
  const { request: updated } = await adminRequest("admin-trade-ins", {
    method: "PATCH",
    id,
    body: updates,
  });
  return mapTradeIn(updated);
}

