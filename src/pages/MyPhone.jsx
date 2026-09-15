import React from "react";
import { Smartphone } from "lucide-react";

import ComingSoon from "../components/ComingSoon";

function MyPhone() {
  return (
    <ComingSoon
      icon={Smartphone}
      title="Mening telefonim"
      description="Eski telefoningizni baholab, yangisiga almashtirish xizmati tez orada ishga tushiriladi."
    />
  );
}

export default MyPhone;
