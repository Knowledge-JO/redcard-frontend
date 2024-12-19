import WebApp from "@twa-dev/types";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}
