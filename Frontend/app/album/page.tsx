"use client";
import { deleteUserImage, getUserImages } from "@/api/imageAPI";
import DeleteButton from "@/components/DeleteButton";
import LinkButton from "@/components/LinkButton";
import { UserImages } from "@/types";
import { getUserSession } from "@/utils/userSession";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
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
  const [userImages, setUserImages] = useState<UserImages[]>();
  const [currentUser, setCurrentUser] = useState<string>();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // get current user
  useEffect(() => {
    (async () => {
      const { user } = await getUserSession();
      setCurrentUser(user?.username);
    })();
  }, []);

  // get current user's images
  const {
    isLoading,
    data: images,
    isError,
    error,
  } = useQuery({
    queryKey: ["images", currentUser],
    queryFn: () =>
      currentUser ? getUserImages(currentUser) : Promise.resolve(null),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchInterval: 3000, // Obtención en tiempo real cada 3 segundos
  });

  useEffect(() => {
    if (images) {
      setUserImages(images.data);
    }
  }, [images]);

  const deletePhoto = useMutation({
    mutationFn: deleteUserImage,
    onSuccess: (data) => {
      if (data.status === 204) {
        alert("Image deleted");
      } else {
        alert(`${data.error}`);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  else if (isError) return <div>Error {error.message}</div>;

  // if no images
  if (images?.data?.length === 0) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 p-4">
        <div>No images</div>
        <div className="mt-4 justify-between">
          <LinkButton
            href="/profile"
            title="Back"
            style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          />
          <LinkButton
            href="/upload"
            title="Upload"
            style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          />
        </div>
      </section>
    );
  }

  // iterate
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {userImages?.map((image) => {
          return (
            <div
              key={image.cod_image}
              className="block max-w-sm mx-auto rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark overflow-hidden"
            >
              <div
                className="relative overflow-hidden bg-cover bg-no-repeat"
                data-twe-ripple-init
                data-twe-ripple-color="light"
              >
                <img
                  className="w-full h-32 object-cover rounded-t-lg"
                  src={`${API_URL}/images/image/${image.image}`}
                  alt=""
                />
              </div>
              <div className="p-4 text-surface">
                <p className="mb-4 text-sm">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <DeleteButton
                  cod_image={image.cod_image}
                  delete_image={deletePhoto.mutate}
                  style="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  title="Eliminar"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 justify-between">
        <LinkButton
          href="/profile"
          title="Back"
          style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
        <LinkButton
          href="/upload"
          title="Upload"
          style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
      </div>
    </section>
  );
};
