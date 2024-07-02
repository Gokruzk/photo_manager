"use client";
import { getUser, updateSessionLocal } from "@/api/userAPI";
import userStore from "@/store/auth/userStore";
import { UserResponse, User_ } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  const authUser = userStore((state) => state.authUser);

  useEffect(() => {
    (async () => {
      const { user, error } = await getUserSession();
      if (error) {
        router.push("/login");
      } else if (user) {
        const us = await getUser(user.username).then((data) => {
          return data;
        });
        if (us.status === 200) {
          const newUser: User_ = {
            cod_user: us.data.cod_user,
            cod_ubi: us.data.cod_ubi,
            country: us.data.ubication.country,
            username: us.data.username,
            email: us.data.email,
            password: "",
            birth_date: us.data.birth_date,
          };
          authUser(newUser);
          setIsSuccess(true);
        }
      }
    })();
  }, [router, authUser]);

  if (!isSuccess) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }
  return (
    <main>
      <header>Navigation</header>
      {children}
    </main>
  );
};

export default ProfileLayout;

async function getUserSession(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/me");
    return { user: data, error: null };
  } catch (e) {
    return {
      error: e as AxiosError,
    };
  }
}
