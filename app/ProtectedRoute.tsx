"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePublicContext } from "@/context/PublicProvider";
import WebApp from "@twa-dev/sdk";
import { Platforms } from "@twa-dev/types";
import Image from "next/image";
import noView from "@/public/noview.webp";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { setUserId, setUsername, setFirstName } = usePublicContext();
  const [platform, setPlatform] = useState<Platforms>();

  useEffect(() => {
    if (!window.Telegram) return console.log("Invalid environment");
    const user_name = WebApp.initDataUnsafe.user?.username;
    const first_name = WebApp.initDataUnsafe.user?.first_name;
    const telegramId = WebApp.initDataUnsafe.user?.id;
    setPlatform(WebApp.platform);
    if (!user_name) return;

    console.log({ user_name, first_name });

    setUsername(user_name);
    setFirstName(first_name);
    setUserId(telegramId);
  }, [setUsername, setFirstName, setUserId]);

  if (platform == "tdesktop" || platform == "unknown")
    return (
      <div className="flex flex-col items-center mt-16">
        <div className="relative h-44 w-44">
          <Image src={noView} fill className="object-cover" alt="" />
        </div>
        <p className="text-stone-600 text-sm">Please open app in telegram</p>
      </div>
    );

  return children;
}

export default ProtectedRoute;
