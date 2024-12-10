"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type DefaultValueTypes = {
  username?: string;
  firstName?: string;
  userId?: number;
  activeId: string;
  setActiveId: Dispatch<SetStateAction<string>>;
  setUsername: Dispatch<SetStateAction<string | undefined>>;
  setFirstName: Dispatch<SetStateAction<string | undefined>>;
  setUserId: Dispatch<SetStateAction<number | undefined>>;
};

const defaultValues: DefaultValueTypes = {
  activeId: "",
  setActiveId() {},
  setUsername() {},
  setFirstName() {},
  setUserId() {},
};

const PublicContext = createContext(defaultValues);

function PublicProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState("");
  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [userId, setUserId] = useState<number>();
  return (
    <PublicContext.Provider
      value={{
        userId,
        activeId,
        setActiveId,
        username,
        firstName,
        setUsername,
        setFirstName,
        setUserId,
      }}
    >
      {children}
    </PublicContext.Provider>
  );
}

function usePublicContext() {
  const context = useContext(PublicContext);

  if (context == undefined)
    throw new Error("Using public context outside context scope");

  return context;
}

export { PublicProvider, usePublicContext };
