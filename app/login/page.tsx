"use client";
import { auth } from "@/api/userAPI";
import LinkButton from "@/components/LinkButton";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const queryClient = new QueryClient();

export default function LoginF() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {register, handleSubmit} = useForm()
  const router = useRouter();

  // auth user mutation
  const authMutation = useMutation({
    mutationFn: auth,
    onSuccess: (data) => {
      if (data.status === 200) {
        alert("Login successfully");
        router.push("/profile");
      } else {
        alert(data.error);
      }
    },
    onError: (error) => {
      console.log(error);
      alert("An error occurred during authentication");
    },
  });

  // get data from form and mutate
  const handleLogin = (formdata: any) => {
    const user = {
      username: formdata.username,
      password: formdata.password
    };
    authMutation.mutate(user);
  };

  // password visibility
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
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
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleLogin)}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username"
                  required
                  {...register("username")}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter password"
                    required
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 py-2"
                    onClick={togglePasswordVisibility}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        className="hs-password-active:hidden"
                        d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                      ></path>
                      <path
                        className="hs-password-active:hidden"
                        d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                      ></path>
                      <path
                        className="hs-password-active:hidden"
                        d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                      ></path>
                      <line
                        className="hs-password-active:hidden"
                        x1="2"
                        x2="22"
                        y1="2"
                        y2="22"
                      ></line>
                      <path
                        className="hidden hs-password-active:block"
                        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                      ></path>
                      <circle
                        className="hidden hs-password-active:block"
                        cx="12"
                        cy="12"
                        r="3"
                      ></circle>
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <LinkButton
                  title="Sign up"
                  href="/register"
                  style="font-medium text-primary-600 hover:underline dark:text-primary-500"
                />
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
