/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  cloneElement,
  createContext,
  DetailedReactHTMLElement,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

type DefaultTypes = {
  activeId: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
};
const defaultValues: DefaultTypes = {
  activeId: "",
  open() {},
  close() {},
};

const modalContext = createContext(defaultValues);

function Modal({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState("");
  const open = setActiveId;
  const close = () => setActiveId("");
  return (
    <modalContext.Provider value={{ activeId, open, close }}>
      {children}
    </modalContext.Provider>
  );
}

function Open({ openId, children }: { openId: string; children: ReactNode }) {
  const { open } = useContext(modalContext);

  return cloneElement(
    children as DetailedReactHTMLElement<
      HTMLAttributes<HTMLElement>,
      HTMLElement
    >,
    { onClick: () => open(openId) }
  );
}

function Window({
  openId,
  title,
  children,
}: {
  openId: string;
  title: string;
  children: ReactNode;
}) {
  const { activeId, close } = useContext(modalContext);

  if (activeId !== openId) return null;
  return (
    <div className="fixed h-screen w-screen bg-white top-0 left-0">
      <div className="bg-gray-200 text-stone-500 px-3 py-3 flex items-center justify-between max-w-lg mx-auto">
        <HiArrowLeftOnRectangle className="text-2xl" onClick={close} />

        <p>{title}</p>
      </div>

      <div className="max-w-lg mx-auto">{children}</div>
    </div>
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
