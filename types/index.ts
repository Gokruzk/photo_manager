import { AxiosError } from "axios";

export interface User {
  cod_user?: number;
  cod_ubi: string;
  cod_state?: number;
  username: string;
  email: string;
  password: string;
  birth_date: string;
}

export interface User_ {
  cod_user: number;
  cod_ubi: number;
  cod_state: number
  country?: string;
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
  username: string;
}

export interface UserResponse {
  user?: UserName;
  error: AxiosError | null;
}

export interface UserSt {
  username: UserName | null;
  authUser: (user: UserName) => void;
  removeSession: () => void;
}

export interface UserState {
  user: User_ | null;
  authUser: (user: User_) => void;
  removeSession: () => void;
}

export interface UserDates {
  cod_date: number;
  cod_user: number;
  cod_description: number;
  description: {
    cod_description: number;
    description: string;
  };
}

interface Description{
  cod_description: number
  description: string
}

interface User_Dates {
  cod_date: number;
  cod_user: number
  cod_description: number
  description: Description
}

export interface User_Retrieve {
  cod_user: number;
  cod_ubi: number;
  cod_state: number
  username: string;
  email: string;
  password: string;
  ubication: Country;
  User_Dates: User_Dates[];
}
