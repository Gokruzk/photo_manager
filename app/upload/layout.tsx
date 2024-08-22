"use client";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AlbumsLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  // check current user session
  useEffect(() => {
    (async () => {
      const { user, error } = await getUserSession();
      if (error) {
        router.push("/login");
      } else if (user) {
          setIsSuccess(true);
      }
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

export default AlbumsLayout;
