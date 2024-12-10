"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
function Navbar() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  return (
    <div className="bg-gray-200 text-stone-500 px-3 py-3 flex items-center justify-between">
      <p> {t("main_header.text")} </p>

      <Select defaultValue="zh" onValueChange={(lang) => changeLanguage(lang)}>
        <SelectTrigger className="w-[110px] h-fit border-none text-stone-700 text-xs focus:ring-0 px-0 shadow-none">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("main_header.lang")}</SelectLabel>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default Navbar;
