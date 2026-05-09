"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from "react";
import type { Category } from "@/lib/types";

export interface MockUser {
  id: string;
  email: string;
  storeId: string;
  storeName: string;
  storeNameZh: string;
  category: Category;
  avatar: string;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "user-1",
    email: "alex@technova.com",
    storeId: "store-electronics",
    storeName: "TechNova Electronics",
    storeNameZh: "锐科电子",
    category: "electronics",
    avatar: "A",
  },
  {
    id: "user-2",
    email: "jordan@summittrail.com",
    storeId: "store-outdoor",
    storeName: "Summit Trail Co.",
    storeNameZh: "峰行户外",
    category: "outdoor",
    avatar: "J",
  },
  {
    id: "user-3",
    email: "sam@pawswhiskers.com",
    storeId: "store-pets",
    storeName: "Paws & Whiskers",
    storeNameZh: "萌宠天地",
    category: "pets",
    avatar: "S",
  },
  {
    id: "user-4",
    email: "mia@vitallife.com",
    storeId: "store-health",
    storeName: "VitalLife Wellness",
    storeNameZh: "维他生活",
    category: "health",
    avatar: "M",
  },
];

export { MOCK_USERS };

interface AuthContextValue {
  user: MockUser | null;
  isHydrated: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isHydrated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("agentshelf-user");
    if (stored) {
      return MOCK_USERS.find((u) => u.id === stored) || null;
    }
    return null;
  });
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const login = useCallback((userId: string) => {
    const found = MOCK_USERS.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      sessionStorage.setItem("agentshelf-user", found.id);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("agentshelf-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isHydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
