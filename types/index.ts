import { AxiosError } from "axios";

export interface User {
  cod_ubi: number;
  username: string;
  email: string;
  password: string;
  birth_date: string;
}

export interface User_ {
  cod_ubi: number;
  username: string;
  email: string;
  password: string;
  birth_date: string;
}

export interface LinkButtonProps {
  title: string;
  href: string;
  style: string;
}

export interface Country {
  cod_ubi: number;
  country: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserName {
  username: string | null
}

export interface UserResponse {
  user: UserName | null;
  error: AxiosError | null;
}

export interface UserState {
  username: UserName | null;
  authUser: (user: UserName) => void;
  removeSession: () => void;
}

export interface UserState2 {
  user: User | null;
  authUser: (user: User) => void;
}

export interface UserCod {
  [key: string]: any;
}