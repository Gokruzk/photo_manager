"use client";

import { UserResponse } from "@/types";
import { getUserSession } from "@/utils/userSession";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { error } = await getUserSession();
      if (error) {
        router.push("/register");
      } else {
        router.push("/profile");
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
