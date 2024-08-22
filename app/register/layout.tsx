"use client";
import { getUserSession } from "@/utils/userSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // check current user session
  useEffect(() => {
    const checkUserSession = async () => {
      const { user, error } = await getUserSession();
      // if the user is not logged return to login
      if (error || !user) {
        router.push("/register");
      } else {
        router.push("/profile");
      }
      setLoading(false);
    };
    checkUserSession();
  }, [router]);

  if (loading) {
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
