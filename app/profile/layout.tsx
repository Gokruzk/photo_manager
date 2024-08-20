"use client";
import { getUser } from "@/api/userAPI";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserSession = async () => {
      const { user, error } = await getUserSession();
      if (error) {
        setIsLoading(false);
        router.push("/login");
        return;
      }

      if (user) {
        try {
          const us = await getUser(user.username);
          if (us.status === 200) {
            setIsLoading(false);
          } else {
            router.push("/login");
          }
        } catch {
          router.push("/login");
        }
      }
    };

    fetchUserSession();
  }, [router]);

  if (isLoading) {
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
