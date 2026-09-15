// Thin wrapper around window.Telegram.WebApp so the rest of the app
// works fine even when opened outside Telegram (plain browser testing).

export function getTelegramWebApp() {
  return typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
}

export function initTelegramApp() {
  const webApp = getTelegramWebApp();

  if (!webApp) return;

  webApp.ready();
  webApp.expand();

  try {
    webApp.setHeaderColor("#ffffff");
    webApp.setBackgroundColor("#ffffff");
  } catch {
    // older Telegram clients may not support these calls
  }
}

export function getInitData() {
  return getTelegramWebApp()?.initData || "";
}

export function getTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user || null;
}

export function hapticFeedback(style = "light") {
  try {
    getTelegramWebApp()?.HapticFeedback?.impactOccurred(style);
  } catch {
    // no-op if unsupported
  }
}
