export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo?: string;
  savedAddresses: SavedAddress[];
}

export interface SavedAddress {
  label: string;
  address: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  phone: string;
}

export interface PhoneVerification {
  phone: string;
  otp: string;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export default initialState; 
