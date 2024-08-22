"use client";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserSession = async () => {
      const { user, error } = await getUserSession();
      if (error || !user) {
        router.push("/login");
      }else{
        setIsSuccess(true)
      }
    };

    fetchUserSession();
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
