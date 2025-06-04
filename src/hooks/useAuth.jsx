import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "null") {
      const userObj = JSON.parse(storedUser);
      const now = Date.now() / 1000;
      if (userObj.exp && userObj.exp > now) {
        setUser(userObj);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  return { user, setUser };
}