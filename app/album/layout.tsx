"use client";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AlbumsLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  // check current user session
  useEffect(() => {
    const checkUserSession = async () => {
      const { user, error } = await getUserSession();
      // if the user is not logged return to login
      if (error || !user) {
        router.push("/login");
      } else {
        setIsSuccess(true);
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

export default AlbumsLayout;
