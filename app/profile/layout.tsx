"use client";

import useStore from "@/store/auth/authStore";
import { UserResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  const authUser = useStore((state) => state.authUser);

  useEffect(() => {
    (async () => {
      const { user, error } = await getUserSession();
      if (error) {
        router.push("/login");
      } else if (user) {
        authUser(user);
        setIsSuccess(true);
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
      user: null,
      error: e as AxiosError,
    };
  }
}
