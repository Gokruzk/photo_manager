import { AxiosError } from "axios";

// Interface para la información de usuario básica
export interface User {
  cod_user?: number;
  cod_ubi: string;
  cod_state?: number;
  username: string;
  email: string;
  password: string;
  birthdate: string;
}

// Interface para la información de usuario extendida
export interface UserDetail {
  cod_user: number;
  cod_ubi: number;
  cod_state: number;
  country?: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
}

// Props para el componente LinkButton
export interface LinkButtonProps {
  title: string;
  href: string;
  style: string;
}

// Información de país
export interface Country {
  cod_ubi: number;
  country: string;
}

// Datos para el login de usuario
export interface UserLogin {
  username: string;
  password: string;
}

// Respuesta de usuario para la autenticación
export interface UserResponse {
  user?: { username: string };
  error: AxiosError | null;
}

// Estado del usuario para la autenticación
export interface AuthState {
  username: string | null;
  authUser: (user: { username: string }) => void;
  removeSession: () => void;
}

// Estado del usuario con detalles completos
export interface UserState {
  user: UserDetail | null;
  authUser: (user: UserDetail) => void;
  removeSession: () => void;
}

// Información de fechas asociadas a un usuario
export interface UserDates {
  cod_date: number;
  cod_user: number;
  cod_description: number;
  description: {
    cod_description: number;
    description: string;
  };
}

// Información completa del usuario recuperado
export interface UserRetrieve {
  cod_user: number;
  cod_ubi: number;
  cod_state: number;
  username: string;
  email: string;
  password: string;
  ubication: Country;
  User_Dates: UserDates[];
}

// Respuesta para obtener un usuario
export interface GetUser {
  status: number;
  data?: UserRetrieve;
  error?: string;
}
