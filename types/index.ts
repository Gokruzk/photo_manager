import { AxiosError } from "axios";

export interface User {
  cod_user?: number;
  cod_ubi: string;
  cod_state?: number;
  username: string;
  email: string;
  password: string;
  birthdate: string;
}

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

export interface LinkButtonProps {
  title: string;
  href: string;
  style: string;
}

export interface Country {
  cod_ubi: number;
  country: string;
}

export interface Images {
  image_file: FileList;
}

export interface ImagesD {
  cod_user: number;
  cod_image: number;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserResponse {
  user?: { username: string };
  error: AxiosError | null;
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

interface Dates {
  cod_date: number;
  year: number;
  month: number;
  day: Date;
}

export interface UserImages {
  cod_image: number;
  cod_ubi: number;
  cod_user: number;
  image: string;
  uploadedat: number;
  ubication: Country;
  uploaded: Dates;
}

export interface ApiPromiseUser {
  status: number;
  data?: UserRetrieve;
  error?: string;
}
export interface ApiPromiseImages {
  status: number;
  data?: UserImages[];
  error?: string;
}

export interface ApiPromiseImagesD {
  status: number;
  error?: string;
}

export interface AuthResponse {
  status: number;
  token?: string;
  error?: string;
}
