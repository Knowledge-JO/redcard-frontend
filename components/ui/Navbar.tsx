"use client";

import { useTranslation } from "react-i18next";
import Switcher from "./Switcher";
function Navbar() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-200 text-stone-500 px-3 py-3 flex items-center justify-between">
      <p> {t("main_header.text")} </p>

      <Switcher />
    </div>
  );
}

export default Navbar;
