"use client";
import { auth, getUser, logout } from "@/api/userAPI";
import LinkButton from "@/components/LinkButton";
import useStore from "@/store/auth/authStore";
import userStore from "@/store/auth/userStore";
import { UserName } from "@/types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const removeSession = useStore();
  const authUser = userStore((state) => state.authUser);

  let user_code = JSON.stringify(useStore((state) => state.username));
  const obj_usercode = JSON.parse(user_code);

  let username: [string, any][] = [];
  if (user_code !== null) {
    username = Object.keys(obj_usercode).map((key) => [
      key,
      obj_usercode[key as keyof UserName],
    ]);
  }

  user_code = username[0][1];

  const {
    isLoading,
    data: user,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", user_code],
    queryFn: () => getUser(user_code),
  });

  const user_info = {
    cod_ubi: user?.data["result"]["cod_ubi"] as number,
    username: user?.data["result"]["username"] as string,
    email: user?.data["result"]["email"] as string,
    password: "" as string,
    birth_date: "" as string,
  };
  
  authUser(user_info);

  const handleLogout = async () => {
    const result = await logout();
    if (result.status === 200) {
      removeSession;
      router.push("/login");
    } else {
      console.error(result.error);
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
              Welcome: {user_info.username}
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
            <LinkButton
              title="Delete account"
              href="#"
              style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded"
            />
            <LinkButton
              title="Manage albums"
              href="#"
              style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
