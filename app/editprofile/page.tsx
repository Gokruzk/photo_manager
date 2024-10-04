"use client";
import { getCountries } from "@/api/countryAPI";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { Country, UserDetail, UserRetrieve } from "@/types";
import { getUser, updateUser } from "@/api/userAPI";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { getUserSession } from "@/utils/userSession";
import { useEffect, useState } from "react";
import LinkButton from "@/components/LinkButton";

const queryClient = new QueryClient();

export default function Edit() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileEdit />
    </QueryClientProvider>
  );
}

function ProfileEdit() {
  const [userRetrieve, setUserRetrieve] = useState<UserRetrieve>();
  const [currentUser, setCurrentUser] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  // password visibility
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  // parse date to YYYYMMDD format
  function parseDate(fecha: string | undefined): string {
    if (fecha) {
      return `${fecha.slice(0, 4)}-${fecha.slice(4, 6)}-${fecha.slice(6, 8)}`;
    }
    return "";
  }

  // get current user
  useEffect(() => {
    (async () => {
      const { user } = await getUserSession();
      setCurrentUser(user?.username);
    })();
  }, []);

  // get current user info
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user", currentUser],
    queryFn: () => (currentUser ? getUser(currentUser) : Promise.resolve(null)),
  });

  // get countries
  const {
    data: countries,
    isLoading: countriesLoading,
    isError: countriesError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  useEffect(() => {
    if (user) {
      setUserRetrieve(user.data);
    }
  }, [user]);

  // reset forms when the data is retrieve again
  useEffect(() => {
    if (userRetrieve) {
      reset({
        email: userRetrieve.email || "",
        username: userRetrieve.username || "",
        birth:
          parseDate(
            userRetrieve.User_Dates.find(
              (date) => date.cod_description === 3
            )?.cod_date.toString()
          ) || "",
        countries:
          `${userRetrieve.ubication.cod_ubi}-${userRetrieve.ubication.country}` ||
          "",
      });
    }
  }, [userRetrieve, reset]);

  const { mutate: updateUserMutation } = useMutation({
    mutationFn: (user: UserDetail) =>
      updateUser(userRetrieve?.username || "None", user),
    onSuccess: (data) => {
      if (data.status === 204) {
        alert("User data updated");
        router.push("/profile");
      } else {
        alert(data.error);
      }
    },
    onError: () => {
      alert("An error occurred during updating");
    },
  });

  // get data from form
  const handleUpdateData = (formdata: any) => {
    const [codUbi] = formdata.countries.split("-");
    const user: UserDetail = {
      cod_user: userRetrieve?.cod_user || 0,
      cod_ubi: codUbi,
      cod_state: 1,
      username: formdata.username,
      email: formdata.email,
      password: formdata.password,
      birthdate: formdata.birth,
    };
    updateUserMutation(user);
  };

  if (userLoading || countriesLoading) return <div>Loading...</div>;
  if (userError || countriesError) return <div>Error occurred</div>;

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              <LinkButton
                title="<- Back"
                href="/profile"
                style="font-medium text-primary-600 hover:underline dark:text-primary-500"
              />
            </p>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Update your info
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleUpdateData)}
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
                  defaultValue={userRetrieve?.email}
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
                  defaultValue={userRetrieve?.username}
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
                  defaultValue={parseDate(
                    userRetrieve?.User_Dates.find(
                      (date) => date.cod_description === 3
                    )?.cod_date.toString()
                  )}
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
                defaultValue={`${userRetrieve?.ubication.cod_ubi}-${userRetrieve?.ubication.country}`}
                {...register("countries")}
              >
                {countries?.data?.map((country: Country) => (
                  <option
                    key={country.cod_ubi}
                    value={`${country.cod_ubi}-${country.country}`}
                  >
                    {country.country}
                  </option>
                ))}
              </select>
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
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
