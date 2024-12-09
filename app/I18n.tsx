"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { ReactNode } from "react";

function I18n({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export default I18n;
