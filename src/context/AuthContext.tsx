import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useReducer, ReactNode } from "react";
import { auth } from "../firebase/config";

// Define the shape of the AuthContext state
interface AuthState {
  user: any | null;
  authIsReady: boolean;
}

// Define the action types
type AuthAction =
  | { type: "LOGIN"; payload: any }
  | { type: "LOGOUT" }
  | { type: "AUTH_IS_READY"; payload: any };

// Define the initial context value
export const AuthContext = createContext<
  AuthState & { dispatch: React.Dispatch<AuthAction> }
>({
  user: null,
  authIsReady: false,
  dispatch: () => undefined,
});

// Auth reducer function with typed parameters
export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

// Define props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component with typed props
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
