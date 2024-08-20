"use client";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const { user, error } = await getUserSession();
      if (error) {
        setIsLoading(false);
        router.push("/login");
        return;
      }
      if (user) {
        router.push("/profile");
      }
      setIsLoading(false);
    };

    checkUserSession();
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
