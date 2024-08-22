"use client";
import { deleteUser, logout } from "@/api/userAPI";
import LinkButton from "@/components/LinkButton";
import { getUserSession } from "@/utils/userSession";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfilePage />
    </QueryClientProvider>
  );
}

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // get current user
  useEffect(() => {
    const fetchUserSession = async () => {
      const { user } = await getUserSession();
      setCurrentUser(user?.username);
      setIsLoading(false);
    };

    fetchUserSession();
  }, []);

  // logout function
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.status === 200) {
        router.push("/");
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // delete account function
  const deleteAccount = async () => {
    if (confirm("Are you sure?") && currentUser) {
      try {
        const result = await deleteUser(currentUser);
        if (result.status === 200) {
          router.push("/");
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Account deletion failed:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              <LinkButton
              title="<- Home"
                href="/"
                style="font-medium text-primary-600 hover:underline dark:text-primary-500"
              />
            </p>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome: {currentUser}
            </h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
            <LinkButton
              title="Modify data"
              href="/editprofile"
              style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded"
            />
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-3 rounded"
              onClick={deleteAccount}
            >
              Delete account
            </button>
            <LinkButton
              title="Manage album"
              href="/album"
              style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
