export interface User {
  cod_user: number;
  cod_ubi: number;
  username: string;
  email: string;
  password: string;
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
