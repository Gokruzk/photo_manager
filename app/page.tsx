import { getCountries } from "@/api/countryAPI";
import LinkButton from "@/components/LinkButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-9 pt-5">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Photo Manager
            </h1>
          </div>
          <div className="px-9 py-5">
            <LinkButton
              title="Login"
              href="/login"
              style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
            />
            <LinkButton
              title="Register"
              href="/register"
              style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
            />
            <LinkButton
              title="About me"
              href="/aboutme"
              style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
