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
  };
}

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
    telegramUserId: row.telegram_user_id,
    telegramUsername: row.telegram_username,
    status: row.status,
    createdAt: row.created_at,
  };
}

// ==================================================
// PUBLIC STOREFRONT
// ==================================================

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProduct(data) : null;
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

// ==================================================
// ADMIN
// ==================================================

async function adminRequest(fn, { method = "GET", id, body } = {}) {
  const url = new URL(`${FUNCTIONS_URL}/${fn}`);
  if (id !== undefined) url.searchParams.set("id", id);

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
