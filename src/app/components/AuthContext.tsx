import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "citizen" | "officer" | "superadmin";
export type Language = "en" | "bn";

interface AuthCtx {
  role: Role;
  setRole: (r: Role) => void;
  userName: string;
  setUserName: (n: string) => void;
  userId: string;
  setUserId: (id: string) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const Ctx = createContext<AuthCtx>({
  role: "citizen",
  setRole: () => {},
  userName: "Demo User",
  setUserName: () => {},
  userId: "u10",
  setUserId: () => {},
  language: "en",
  setLanguage: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("citizen");
  const [userName, setUserName] = useState("Demo User");
  const [userId, setUserId] = useState("u10");
  const [language, setLanguage] = useState<Language>("en");
  return (
    <Ctx.Provider value={{ role, setRole, userName, setUserName, userId, setUserId, language, setLanguage }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}
