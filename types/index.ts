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

export interface UserResponse {
  user: string | null;
  error: AxiosError | null;
}
