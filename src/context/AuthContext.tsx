import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../auth/firebase";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const idToken = await getIdToken(currentUser);
        setUser(currentUser);
        setToken(idToken);
        localStorage.setItem("token", idToken);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
