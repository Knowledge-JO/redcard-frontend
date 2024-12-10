import WebApp from "@twa-dev/types";

declare global {
  interface Window {
    Telegram?: {
      Webapp?: WebApp;
    };
  }
}
