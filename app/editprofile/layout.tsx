"use client";

import userStore from "@/store/auth/userStore";
import { UserResponse, User_ } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

const EditLayout = ({ children }: { children: React.ReactNode }) => {
  const user_info = userStore((state) => state.user);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { user, error } = await getUserSession();
      if (error) {
        router.push("/login");
      } else if (user) {
        setIsSuccess(true);
      }
      //If the user is logged
      setIsSuccess(true);
    })();
  }, [router]);

  if (!isSuccess) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  let userProp: User_ = {
    cod_user: "",
    cod_ubi: 1,
    country: "Example Country",
    username: "exampleuser",
    email: "example@example.com",
    password: "password123",
    birth_date: "1900-01-01",
  };

  if (user_info) {
    userProp = {
      cod_user: user_info.cod_user,
      cod_ubi: user_info.cod_ubi,
      country: user_info.country,
      username: user_info.username,
      email: user_info.email,
      password: user_info.password,
      birth_date: user_info.birth_date,
    };
  }

  // Clone the children with the additional props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, userProp);
    }
    return child;
  });

  return (
    <main>
      <header>Navigation</header>
      {childrenWithProps}
    </main>
  );
};

async function getUserSession(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/me");
    return {
      user: data,
      error: null,
    };
  } catch (e) {
    return {
      error: e as AxiosError,
    };
  }
}

export default EditLayout;
