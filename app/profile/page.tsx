"use client";
import { deleteUser, getUser, logout } from "@/api/userAPI";
import LinkButton from "@/components/LinkButton";
import userStore from "@/store/auth/userStore";
import { UserDates, User_, UserName } from "@/types";
import { getUserSession } from "@/utils/userSession";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const queryClient = new QueryClient();

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfilePage />
    </QueryClientProvider>
  );
}

const ProfilePage = () => {
  const [current_user, setCurrentuser] = useState<string>();
  const [isLoading, setIsloading] = useState(true);
  const router = useRouter();

  // const {
  //   isLoading,
  //   data: user,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["user", current_user],
  //   queryFn: () => {
  //     if (current_user) {
  //       return getUser(current_user);
  //     } else {
  //       return Promise.resolve(null); // Devuelve un valor por defecto si current_user es undefined
  //     }
  //   },
  //   retry: 3,
  //   retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  //   refetchInterval: 3000, // Obtención en tiempo real cada 2 segundos
  // });

  const user_session = useCallback(async () => {
    const { user } = await getUserSession();
    setCurrentuser(user?.username);
  }, []);

  useEffect(() => {
    user_session();
  }, [user_session]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.status === 200) {
      router.push("/");
    } else {
      console.error(result.error);
    }
  };

  const deleteAccount = async () => {
    const res = confirm("Are you sure?");
    if (res && current_user) {
      const result = await deleteUser(current_user);
      if (result.status === 200) {
        router.push("/");
      } else {
        console.error(result.error);
      }
    }
  };

  if (isLoading) {
    setIsloading(false)
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              <Link
                href={"/"}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                {"<-"} Home
              </Link>
            </p>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome: {current_user}
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
