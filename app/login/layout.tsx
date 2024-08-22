"use client";
import { getUser } from "@/api/userAPI";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  // check current user session
  useEffect(() => {
    const checkUserSession = async () => {
      const { user, error } = await getUserSession();
      // if the user is not logged return to login
      if (error || !user) {
        setIsSuccess(true)
      } else {
        // check if the user exist
        if (user) {
          try {
            const us = await getUser(user.username);
            if (us.status === 200) {
              router.push("/profile");
              setIsSuccess(true)
            } else {
              router.push("/login");
            }
          } catch {
            router.push("/login");
          }
        }
      }
    };
    checkUserSession();
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
