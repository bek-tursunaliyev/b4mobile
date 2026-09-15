import React from "react";
import { Package } from "lucide-react";

import ComingSoon from "../components/ComingSoon";

function Orders() {
  return (
    <ComingSoon
      icon={Package}
      title="Buyurtmalarim"
      description="Bu yerda siz o‘z buyurtmalaringiz tarixini kuzatib borishingiz mumkin bo‘ladi. Xizmat tez orada ishga tushiriladi."
    />
  );
}

export default Orders;
