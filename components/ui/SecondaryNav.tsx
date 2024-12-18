import Link from "next/link";
import { ReactNode } from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

function SecondaryNav({ to, children }: { to: string; children: ReactNode }) {
  return (
    <div className="bg-gray-200 text-stone-500 px-3 py-3 flex items-center justify-between">
      <Link href={to}>
        <HiArrowLeftOnRectangle className="text-2xl" />
      </Link>

      <div>{children}</div>
    </div>
  );
}

export default SecondaryNav;
