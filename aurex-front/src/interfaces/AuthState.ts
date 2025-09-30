import { initUser, User } from "./Users";

// Context types
export interface AuthContextType {
  sesion: AuthState;
  setSesion: (newData: Partial<AuthState>) => void;
}

// Global store type
export interface AuthState {
  user: User;
}

export const initAuthState = (): AuthState => ({
  user: initUser(),
});
