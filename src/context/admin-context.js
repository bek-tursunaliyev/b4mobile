import { createContext } from "react";

export const AdminContext = createContext({
  isAdmin: false,
  telegramUser: null,
  loading: true,
});
