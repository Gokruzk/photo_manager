"use client";
import LinkButton from "@/components/LinkButton";
import userStore from "@/store/auth/userStore";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Profile() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfilePage />
    </QueryClientProvider>
  );
}

const ProfilePage = () => {
  let current_user = userStore((state) => state.user);

  let user_name = "";
  if (current_user) {
    user_name = current_user.username;
  }

  // const {
  //   isLoading,
  //   data: user,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["user", user_name],
  //   queryFn: () => getUser(user_name),
  //   retry: 3,
  //   retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  //   refetchInterval: 3000, // Obtención en tiempo real cada 2 segundos
  // });

  // useEffect(() => {
  //   if (user) {
  //     const b = user.data.User_Dates.find(
  //       (date: UserDates) => date.description.description === "birthday"
  //     )?.cod_date;
  //     const user_info: User_ = {
  //       cod_user: user.data.cod_user,
  //       cod_ubi: user.data.ubication.cod_ubi,
  //       country: user.data.ubication.country,
  //       username: user.data.username,
  //       email: user.data.email,
  //       password: "",
  //       birth_date: b?.toString() ?? "",
  //     };
  //     authUser(user_info);
  //   }
  // }, [user, authUser]);

  // if (isLoading) return <div>Loading...</div>;
  // else if (isError) return <div>Error {error.message}</div>;

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div>Hola</div>
      <div className="block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark">
        <div
          className="relative overflow-hidden bg-cover bg-no-repeat"
          data-twe-ripple-init
          data-twe-ripple-color="light"
        >
          <img
            className="rounded-t-lg"
            src="https://tecdn.b-cdn.net/img/new/standard/nature/186.jpg"
            alt=""
          />
          <a href="#!">
            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
          </a>
        </div>
        <div className="p-6 text-surface">
          <h5 className="mb-2 text-xl font-medium leading-tight">Card title</h5>
          <p className="mb-4 text-base">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
            Button
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
            data-twe-ripple-init
            data-twe-ripple-color="light"
          >
            Eliminar
          </button>
        </div>
      </div>

      <LinkButton
        href="/profile"
        title="Back"
        style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
      />
      <LinkButton
        href="/upload"
        title="Upload"
        style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
      />
    </section>
  );
};
