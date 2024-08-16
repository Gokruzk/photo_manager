"use client";
import { deleteUser, getUser, logout } from "@/api/userAPI";
import LinkButton from "@/components/LinkButton";
import userStore from "@/store/auth/userStore";
import { UserDates, User_ } from "@/types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfilePage />
    </QueryClientProvider>
  );
}

const ProfilePage = () => {
  const router = useRouter();
  const authUser = userStore((state) => state.authUser);

  let user_code = userStore((state) => state.user);

  let user_name = "";
  if (user_code) {
    user_name = user_code.username;
  }

  const {
    isLoading,
    data: user,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", user_name],
    queryFn: () => getUser(user_name),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchInterval: 3000, // Obtención en tiempo real cada 2 segundos
  });

  let b: number = 0,
    c: number = 0,
    m: number = 0;

  user?.data["User_Dates"].map((date: UserDates) => {
    if (date.description.description == "birthday") {
      b = date.cod_date;
    }
    if (date.description.description == "modified") {
      m = date.cod_date;
    }
    if (date.description.description == "created") {
      c = date.cod_date;
    }
  });

  useEffect(() => {
    if (user) {
      const b = user.data.User_Dates.find(
        (date: UserDates) => date.description.description === "birthday"
      )?.cod_date;
      const user_info: User_ = {
        cod_user: user.data.cod_user,
        cod_ubi: user.data.ubication.cod_ubi,
        country: user.data.ubication.country,
        username: user.data.username,
        email: user.data.email,
        password: "",
        birth_date: b?.toString() ?? "",
      };
      authUser(user_info);
    }
  }, [user, authUser]);

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
    if (res) {
      const result = await deleteUser(user_name);
      if (result.status === 200) {
        router.push("/");
      } else {
        console.error(result.error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  else if (isError) return <div>Error {error.message}</div>;

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
              Welcome: {user_code?.username}
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
