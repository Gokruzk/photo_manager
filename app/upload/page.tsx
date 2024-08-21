"use client";
import { uploadImage } from "@/api/imageAPI";
import LinkButton from "@/components/LinkButton";
import { Images } from "@/types";
import { getUserSession } from "@/utils/userSession";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ImageUploadForm = () => {
  const [currentUser, setCurrentUser] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Images>();

  useEffect(() => {
    (async () => {
      const { user } = await getUserSession();
      setCurrentUser(user?.username);
    })();
  }, []);

  const handleUpload = async (image: Images) => {
    if (image.image_file.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    if (currentUser) {
      const formData = new FormData();
      formData.append("username", currentUser);
      formData.append("file", image.image_file[0]);

      try {
        const result = await uploadImage(formData);
        if (result.status === 200) {
          alert(`Image uploaded successfully. Filename: ${result.filename}`);
        } else {
          alert("Failed to upload image.");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleUpload)}>
      <input
        type="file"
        id="image_file"
        {...register("image_file", { required: "Please upload a file" })}
      />
      {errors.image_file && <p>{errors.image_file.message}</p>}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
        data-twe-ripple-init
        data-twe-ripple-color="light"
      >
        Upload Image
      </button>
      <LinkButton
        title="Back"
        href="/album"
        style="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
      />
    </form>
  );
};

export default ImageUploadForm;
