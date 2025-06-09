import { createContext, useContext, useState, useEffect } from "react";
import { parseJwt } from "../utils/stringUtils";
import { getCookie } from "../utils/tokenUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookieToken = getCookie("token");
    if (cookieToken) {
      const userObj = parseJwt(cookieToken);
      const now = Date.now() / 1000;
      const maxAge = userObj.exp - now; 

      if (userObj.exp && userObj.exp > now) {
        setUser(userObj);
        document.cookie = `token=${cookieToken}; path=/; max-age=${maxAge}`;
      } else {
        setUser(null);
        document.cookie = "token=; path=/; max-age=0";
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}