import { useEffect, useMemo, useState } from "react";

const USERS_KEY = "product_listing_users";
const SESSION_KEY = "product_listing_session";

function readUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function readSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function useLocalAuth() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setUsers(readUsers());
    setCurrentUser(readSession());
  }, []);

  const isAuthenticated = useMemo(() => Boolean(currentUser), [currentUser]);

  const signup = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName || !normalizedEmail || !password) {
      setAuthError("All fields are required.");
      return false;
    }

    const existingUsers = readUsers();
    if (existingUsers.some((user) => user.email === normalizedEmail)) {
      setAuthError("An account with this email already exists.");
      return false;
    }

    const nextUser = {
      id: Date.now(),
      name: trimmedName,
      email: normalizedEmail,
      password,
    };

    const nextUsers = [...existingUsers, nextUser];
    window.localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id: nextUser.id, name: nextUser.name, email: nextUser.email })
    );

    setUsers(nextUsers);
    setCurrentUser({ id: nextUser.id, name: nextUser.name, email: nextUser.email });
    setAuthError("");
    return true;
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUsers = readUsers();
    const matchedUser = existingUsers.find(
      (user) => user.email === normalizedEmail && user.password === password
    );

    if (!matchedUser) {
      setAuthError("Invalid email or password.");
      return false;
    }

    const sessionUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    setAuthError("");
    return true;
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setAuthError("");
  };

  return {
    authError,
    currentUser,
    isAuthenticated,
    login,
    logout,
    signup,
    clearAuthError: () => setAuthError(""),
  };
}
