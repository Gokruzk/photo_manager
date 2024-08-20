"use client";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const { user, error } = await getUserSession();
      if (error || !user) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
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

export default EditLayout;
