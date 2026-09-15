import { useContext } from "react";
import { AdminContext } from "../context/admin-context";

export function useAdmin() {
  return useContext(AdminContext);
}
