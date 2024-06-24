"use client";

import { UserResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();
      if (error) {
        router.push("/login");
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
  return (
    <main>
      <header>Navigation</header>
      {children}
    </main>
  );
};

export default ProfileLayout;

async function getUser(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/me");
    return {
      user: data,
      error: null,
    };
  } catch (e) {
    return {
      user: null,
      error: e as AxiosError,
    };
  }
}
