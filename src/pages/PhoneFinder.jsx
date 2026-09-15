import React from "react";
import { Search } from "lucide-react";

import ComingSoon from "../components/ComingSoon";

function PhoneFinder() {
  return (
    <ComingSoon
      icon={Search}
      title="Telefon tanlash yordamchisi"
      description="Ehtiyojingizga mos telefonni tanlashda yordam beruvchi anketa tez orada ishga tushiriladi."
    />
  );
}

export default PhoneFinder;
