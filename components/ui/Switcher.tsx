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

function Switcher() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  return (
    <Select onValueChange={(lang) => changeLanguage(lang)}>
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
  );
}

export default Switcher;
