"use client";
import { getCountries } from "@/api/countryAPI";
import Link from "next/link";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { Country, User, User_ } from "@/types";
import { updateUser } from "@/api/userAPI";
import userStore from "@/store/auth/userStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const queryClient = new QueryClient();

export default function Edit() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileEdit />
    </QueryClientProvider>
  );
}

function ProfileEdit() {
  const router = useRouter();
  const user = userStore((state) => state.user);
  console.log(user)
  const { register, handleSubmit } = useForm();

  let user_edit: User_ = {
    cod_user: "",
    cod_ubi: 0,
    username: "",
    email: "",
    password: "",
    birth_date: "",
  };

  if (user) {
    user_edit = {
      cod_user: user.cod_user,
      cod_ubi: user.cod_ubi,
      country: user.country,
      username: user.username,
      email: user.email,
      password: user.password,
      birth_date: user.birth_date,
    };
  }

  const updateData = async (formdata: any) => {
    const username = formdata.username;
    const email = formdata.email;
    const password = formdata.password;
    const ubi = formdata.countries;
    const [codUbi] = ubi.split("-");
    const birth = formdata.birth;
    const user = {
      cod_user: user_edit.cod_user,
      cod_ubi: codUbi,
      cod_state: 1,
      username: username,
      email: email,
      password: password,
      birth_date: birth,
    };
    addUserMutation.mutate(user);
  };

  const addUserMutation = useMutation({
    mutationFn: (userr: User_) => {
      return updateUser(user_edit.username, userr);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        alert("User data updated");
        router.push("/profile");
      } else {
        alert(data.error);
      }
    },
    onError: (error) => {
      console.log(error);
      alert("An error occurred during updating");
    },
  });

  const retrieveCountries = () => {
    const {
      isLoading: loadingCountries,
      data: countries,
      isError: errorC,
      error: errorM,
    } = useQuery({
      queryKey: ["countries"],
      queryFn: getCountries,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchInterval: 10000, // Get data every 2 seconds
    });
    return { loadingCountries, countries, errorC, errorM };
  };

  const { loadingCountries, countries, errorC, errorM } = retrieveCountries();

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement | null;

    if (passwordInput) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
      } else {
        passwordInput.type = "password";
      }
    }
  }

  function parseCustomDate(fecha: string | undefined): string {
    if (fecha) {
      const year = fecha.slice(0, 4);
      const month = fecha.slice(4, 6);
      const day = fecha.slice(6, 8);
      return `${year}-${month}-${day}`;
    }
    return "";
  }

  const birthdate = parseCustomDate(user_edit.birth_date);

  if (loadingCountries) return <div>Loading...</div>;
  else if (errorC) return <div>Error {errorM && errorM.message}</div>;

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              <Link
                href={"/profile"}
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                {"<-"} Back
              </Link>
            </p>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Update your info
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(updateData)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="email@email.com"
                  defaultValue={user_edit.email}
                  required
                  {...register("email")}
                />
                <label
                  htmlFor="username"
                  className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username"
                  defaultValue={user_edit.username}
                  required
                  {...register("username")}
                />
              </div>

              <label
                htmlFor="birth"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select your birth date
              </label>
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  id="birth"
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date"
                  defaultValue={birthdate}
                  {...register("birth")}
                />
              </div>

              <label
                htmlFor="countries"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select your country
              </label>
              <select
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("countries")}
              >
                <option
                  key={user_edit.cod_ubi}
                  value={`${user_edit.cod_ubi}-${user_edit.country}`}
                >
                  {user_edit.country}
                </option>
                {countries?.data.map((country: Country) => {
                  return (
                    <option
                      key={country.cod_ubi}
                      value={`${country.cod_ubi}-${country.country}`}
                    >
                      {country.country}
                    </option>
                  );
                })}
              </select>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your new password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter password"
                    defaultValue={""}
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
                className="bg-blue-500 hover:bg-blue-700 w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
