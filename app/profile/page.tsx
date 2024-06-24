"use client";
import { logout } from "@/api/userAPI";
import LinkButton from "@/components/LinkButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const result = await logout();
    if (result.status === 200) {
      router.push("/login");
    } else {
      console.error(result.error);
    }
  };
  return (
    <main>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative w-full group max-w-md min-w-0 mx-auto mt-6 mb-6 break-words bg-white border shadow-2xl dark:bg-gray-800 dark:border-gray-700 md:max-w-sm rounded-xl">
          <div className="mt-5 text-center">
            <h3 className="mb-1 text-2xl font-bold leading-normal text-gray-700 dark:text-gray-300">
              Usuario
            </h3>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
