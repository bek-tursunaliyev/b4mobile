import React, { useEffect, useMemo, useState } from "react";

import { AdminContext } from "./admin-context";
import { verifyAdmin } from "../lib/api";

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [telegramUser, setTelegramUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    verifyAdmin()
      .then((res) => {
        if (!mounted) return;
        setIsAdmin(Boolean(res.isAdmin));
        setTelegramUser(res.user || null);
      })
      .catch(() => {
        if (!mounted) return;
        setIsAdmin(false);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ isAdmin, telegramUser, loading }),
    [isAdmin, telegramUser, loading]
  );

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
